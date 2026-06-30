"""DataUpdateCoordinator for Precision Grow.

Reads source sensors, computes derived values and holds the persistent
runtime state (phase, dryback peak/trough, runoff log, energy accumulation,
harvest data).
"""
from __future__ import annotations

import asyncio
import csv
from datetime import date, datetime, timedelta
import functools
import glob
import json
import logging
import os
import shutil
from typing import Any

from homeassistant.components.persistent_notification import (
    async_create as pn_async_create,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, State
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util, slugify

from .const import (
    CONF_CONTAINER_SIZE_ML,
    CONF_DEVICE_CO2_VALVE,
    CONF_DEVICE_COOLER,
    CONF_DEVICE_DEHUMIDIFIER,
    CONF_DEVICE_EXHAUST,
    CONF_DEVICE_HEATER,
    CONF_DEVICE_HUMIDIFIER,
    CONF_DEVICE_PUMP,
    CONF_FLOWER_DAYS,
    CONF_FLOWER_PHOTOPERIOD,
    CONF_LEAF_OFFSET,
    CONF_LIGHTS_ON,
    CONF_MEDIA_PATH,
    CONF_NUTRIENT_PRESET,
    CONF_PHOTOPERIOD,
    CONF_PLANT_TYPE,
    CONF_POWER_ENTITIES,
    CONF_POWER_PRICE,
    CONF_SENSOR_BRIGHTNESS,
    CONF_SENSOR_CO2,
    CONF_SENSOR_EC,
    CONF_SENSOR_HUMIDITY,
    CONF_SENSOR_PH,
    CONF_SENSOR_PPFD,
    CONF_SENSOR_RESERVOIR,
    CONF_SENSOR_TEMP,
    CONF_SENSOR_WATER_TEMP,
    CONF_SENSOR_WEIGHT,
    CONF_START_DATE,
    CONF_STRAIN,
    CONF_TANK_VOLUME_L,
    CONF_VEG_DAYS,
    DEFAULT_FLOWER_PHOTOPERIOD,
    DEFAULT_FLOWER_POSTPONE,
    DEFAULT_VEG_DAYS,
    DEFAULT_LEAF_OFFSET,
    DEFAULT_LIGHTS_ON,
    DEFAULT_MEDIA_PATH,
    DEFAULT_PHOTOPERIOD,
    DEFAULT_POWER_PRICE,
    DEFAULT_TANK_VOLUME_L,
    DOMAIN,
    NUM_FLOWER_POSTPONE,
    NUM_LIGHT_DISTANCE,
    NUM_PPFD_AT_FULL,
    NUM_PPFD_MANUAL,
    NUM_PPFD_REF_DISTANCE,
    NUTRIENT_PROFILES,
    PHASE_BRIGHTNESS,
    PHASE_BULK,
    PHASE_RIPEN,
    PHASE_STRETCH,
    PHASE_TARGETS,
    PHASE_VEG,
    RESERVOIR_CRITICAL_PCT,
    RESERVOIR_LOW_PCT,
    TEXT_DIARY_COMMENT,
    TEXT_DIARY_IMAGE,
    RUNOFF_TARGET_GEN_PCT,
    RUNOFF_TARGET_VEG_PCT,
    analyze_runoff,
    calculate_dli,
    calculate_dryback,
    calculate_lvpd,
    calculate_vpd,
    determine_p_phase,
    next_training_event,
    reservoir_pct_from_distance,
    status_in_range,
)

_LOGGER = logging.getLogger(__name__)

UPDATE_INTERVAL_SECONDS = 30
STORAGE_VERSION = 1
STATE_SAVE_DEBOUNCE = 300  # seconds; debounced disk write for per-cycle mutations

# Mapping growth phase -> irrigation/generative mode (veg|gen) for runoff
_GEN_PHASES = {PHASE_STRETCH, PHASE_BULK, PHASE_RIPEN}


class PrecisionGrowCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Central calculation and state logic."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=f"{DOMAIN}_{entry.entry_id[:8]}",
            update_interval=timedelta(seconds=UPDATE_INTERVAL_SECONDS),
        )
        self.entry = entry
        self._store = Store(hass, STORAGE_VERSION, f"{DOMAIN}_{entry.entry_id}")
        self._test_running = False
        self._compare_sources: dict[str, Any] = {}

        # Runtime state (persisted)
        self.state: dict[str, Any] = {
            "phase": PHASE_VEG,
            "peak_weight": None,
            "trough_weight": None,
            "peak_day": None,            # ISO date of the current peak/trough day
            "runoff_log": [],            # list of runoff entries
            "energy_kwh": {},            # entity_id -> kWh
            "harvest": {},               # wet/dry/extra_cost
            "last_energy_ts": None,      # ISO timestamp of last energy integration
            "numbers": {},               # values set via number entities
            "text_inputs": {},           # values set via text entities
            "diary": {},                 # diary: {date_iso: {snapshot, comment, image}}
            # Field-capacity hybrid / weight time series
            "field_capacity": None,      # calibrated saturated weight
            "dry_weight": None,          # calibrated dry weight
            "last_weight": None,         # previous weight (for rate)
            "last_weight_ts": None,
            "ema_transpiration": None,   # smoothed transpiration g/h
            # Reservoir calibration (VL53L0X distance mm)
            "res_dist_empty": None,
            "res_dist_full": None,
            # Phase timestamps
            "phase_changed_date": None,
            "flower_start_date": None,
            # Flower switch (regular): accumulated postpone days
            "veg_extended_days": 0,
            # Lights-on time override set via the time entity (HH:MM:SS)
            "lights_on_override": None,
        }

    # ------------------------------------------------------------------ #
    # Persistence
    # ------------------------------------------------------------------ #
    async def async_load_state(self) -> None:
        stored = await self._store.async_load()
        if stored:
            self.state.update(stored)

    async def async_save_state(self) -> None:
        """Persist the runtime state immediately (used on explicit mutations)."""
        await self._store.async_save(self.state)

    def _schedule_state_save(self) -> None:
        """Debounced persist for per-cycle mutations (energy, dryback, diary).

        Avoids writing the full state to disk every 30 s (SD-card wear). The
        delayed save coalesces calls and is flushed on HA shutdown.
        """
        self._store.async_delay_save(lambda: self.state, STATE_SAVE_DEBOUNCE)

    # ------------------------------------------------------------------ #
    # Helpers
    # ------------------------------------------------------------------ #
    def _opt(self, key: str, default: Any) -> Any:
        """Runtime number over option over data over default."""
        numbers = self.state.get("numbers", {})
        if key in numbers and numbers[key] is not None:
            return numbers[key]
        if key in self.entry.options:
            return self.entry.options[key]
        return self.entry.data.get(key, default)

    async def async_set_number(self, key: str, value: float) -> None:
        """Store a number entity value."""
        self.state.setdefault("numbers", {})[key] = value
        await self.async_save_state()
        await self.async_request_refresh()

    def _float_state(self, conf_key: str) -> float | None:
        """Get the numeric state of a mapped source entity."""
        entity_id = self.entry.data.get(conf_key)
        if not entity_id:
            return None
        st: State | None = self.hass.states.get(entity_id)
        if st is None or st.state in ("unknown", "unavailable", "", None):
            return None
        try:
            return float(st.state)
        except (ValueError, TypeError):
            return None

    @property
    def nutrient_profile(self) -> dict[str, Any]:
        preset = self.entry.data.get(CONF_NUTRIENT_PRESET, "lucas_coco")
        return NUTRIENT_PROFILES.get(preset, NUTRIENT_PROFILES["lucas_coco"])

    @property
    def phase(self) -> str:
        return self.state["phase"]

    def lights_on(self) -> str:
        """Configured lights-on time (HH:MM:SS), overridable via the time entity."""
        override = self.state.get("lights_on_override")
        if override:
            return override
        return self._opt(CONF_LIGHTS_ON, DEFAULT_LIGHTS_ON)

    async def async_set_lights_on(self, value: str) -> None:
        self.state["lights_on_override"] = value
        await self.async_save_state()
        await self.async_request_refresh()

    def effective_photoperiod(self, phase: str) -> float:
        """Photoperiod depending on plant type/phase.

        Autoflower: constant. Regular: flower photoperiod (12h) during flowering phases.
        """
        base = float(self._opt(CONF_PHOTOPERIOD, DEFAULT_PHOTOPERIOD))
        if self.entry.data.get(CONF_PLANT_TYPE) == "auto":
            return base
        if phase in (PHASE_STRETCH, PHASE_BULK, PHASE_RIPEN):
            return float(self._opt(CONF_FLOWER_PHOTOPERIOD, DEFAULT_FLOWER_PHOTOPERIOD))
        return base

    def effective_veg_days(self) -> int:
        """Configured veg days plus accumulated postpone days."""
        base = int(self._opt(CONF_VEG_DAYS, DEFAULT_VEG_DAYS) or 0)
        return base + int(self.state.get("veg_extended_days", 0) or 0)

    def _flower_switch_due(self) -> bool:
        """True when a regular plant has reached veg time and is still in veg."""
        if self.entry.data.get(CONF_PLANT_TYPE) == "auto":
            return False
        if self.phase != PHASE_VEG:
            return False
        veg_days = self.effective_veg_days()
        return veg_days > 0 and self._day_total() >= veg_days

    async def async_confirm_flower_switch(self) -> None:
        """Confirm the 12/12 switch: move to stretch (flowering)."""
        await self.async_set_phase(PHASE_STRETCH)

    async def async_postpone_flower_switch(self) -> None:
        """Postpone the flower switch by the configured number of days."""
        days = int(self._num(NUM_FLOWER_POSTPONE) or DEFAULT_FLOWER_POSTPONE)
        self.state["veg_extended_days"] = (
            int(self.state.get("veg_extended_days", 0) or 0) + days
        )
        await self.async_save_state()
        await self.async_request_refresh()

    def phase_targets(self, phase: str) -> dict[str, Any]:
        """Phase targets: defaults from const, overridden by options."""
        base = dict(PHASE_TARGETS.get(phase, PHASE_TARGETS[PHASE_VEG]))
        overrides = (self.entry.options.get("phase_targets") or {}).get(phase)
        if overrides:
            base.update(overrides)
        return base

    def _day_total(self) -> int:
        start = self.entry.data.get(CONF_START_DATE)
        if not start:
            return 0
        try:
            start_date = date.fromisoformat(start)
        except (ValueError, TypeError):
            return 0
        return max(0, (dt_util.now().date() - start_date).days + 1)

    def _date_state(self, key: str) -> date | None:
        val = self.state.get(key)
        if not val:
            return None
        try:
            return date.fromisoformat(val)
        except (ValueError, TypeError):
            return None

    def _day_in_phase(self) -> int:
        start = self._date_state("phase_changed_date")
        if start is None:
            return self._day_total()
        return max(0, (dt_util.now().date() - start).days + 1)

    def _flower_day(self) -> int | None:
        """Day since flowering start (entry into stretch). None if not flowering yet."""
        start = self._date_state("flower_start_date")
        if start is None:
            return None
        return max(0, (dt_util.now().date() - start).days + 1)

    def _num(self, key: str) -> float:
        """Value of a settings/input number from the state (default 0)."""
        return float(self.state.get("numbers", {}).get(key, 0) or 0)

    def _brightness_pct(self) -> float | None:
        """Brightness in % from the mapped light/brightness entity."""
        entity_id = self.entry.data.get(CONF_SENSOR_BRIGHTNESS)
        if not entity_id:
            return None
        st = self.hass.states.get(entity_id)
        if st is None or st.state in ("unknown", "unavailable", ""):
            return None
        if entity_id.startswith("light."):
            if st.state == "off":
                return 0.0
            br = st.attributes.get("brightness")
            if br is not None:
                return round(float(br) / 255 * 100, 1)
            return 100.0
        try:
            val = float(st.state)
        except (ValueError, TypeError):
            return None
        return val if val <= 100 else round(val / 255 * 100, 1)

    def _resolve_ppfd(self) -> tuple[float | None, str]:
        """Resolve PPFD source: sensor > brightness estimate > manual."""
        sensor = self._float_state(CONF_SENSOR_PPFD)
        if sensor is not None:
            return sensor, "sensor"
        br = self._brightness_pct()
        full = self._num(NUM_PPFD_AT_FULL)
        if br is not None and full:
            est = full * br / 100.0
            d = self._num(NUM_LIGHT_DISTANCE)
            d0 = self._num(NUM_PPFD_REF_DISTANCE)
            if d > 0 and d0 > 0:
                est *= (d0 / d) ** 2  # inverse-square Abstandskorrektur
            return round(est, 0), "estimate"
        manual = self._num(NUM_PPFD_MANUAL)
        if manual:
            return manual, "manual"
        return None, "none"

    def _shot_volume_1pct(self) -> float:
        """1 % des Topfvolumens in mL."""
        pot_ml = float(self._opt(CONF_CONTAINER_SIZE_ML, 3000) or 3000)
        return round(pot_ml / 100.0, 1)

    def _p_phase(self, photoperiod: float) -> str:
        """Current irrigation day phase P0-P3 from the light schedule."""
        lights_on = self.lights_on()
        try:
            parts = [int(x) for x in str(lights_on).split(":")]
            on_minutes = parts[0] * 60 + (parts[1] if len(parts) > 1 else 0)
        except (ValueError, TypeError):
            on_minutes = 6 * 60
        now = dt_util.now()
        now_minutes = now.hour * 60 + now.minute
        elapsed = (now_minutes - on_minutes) % (24 * 60)
        if elapsed >= photoperiod * 60:
            return determine_p_phase(None, photoperiod)
        return determine_p_phase(elapsed, photoperiod)

    def _light_status(self, photoperiod: float) -> dict[str, Any]:
        """Light on/off, elapsed %, remaining time, on/off time."""
        lights_on = self.lights_on()
        try:
            p = [int(x) for x in str(lights_on).split(":")]
            on_min = p[0] * 60 + (p[1] if len(p) > 1 else 0)
        except (ValueError, TypeError):
            on_min = 6 * 60
        photo_min = int(photoperiod * 60)
        off_min = (on_min + photo_min) % (24 * 60)
        now = dt_util.now()
        now_min = now.hour * 60 + now.minute
        elapsed = (now_min - on_min) % (24 * 60)

        def _hhmm(m: int) -> str:
            return f"{(m // 60) % 24:02d}:{m % 60:02d}"

        out: dict[str, Any] = {
            "lights_on_time": _hhmm(on_min),
            "lights_off_time": _hhmm(off_min),
        }
        if photo_min <= 0:
            out.update(light_on=False, light_elapsed_pct=0, light_remaining_min=0)
            return out
        if elapsed < photo_min:
            out["light_on"] = True
            out["light_elapsed_pct"] = round(elapsed / photo_min * 100, 1)
            out["light_elapsed_min"] = elapsed
            out["light_remaining_min"] = photo_min - elapsed
        else:
            out["light_on"] = False
            out["light_elapsed_pct"] = 0.0
            out["light_elapsed_min"] = 0
            out["light_remaining_min"] = (24 * 60) - elapsed  # until next lights-on
        return out

    def _update_transpiration(
        self,
        weight: float,
        data: dict[str, Any],
        fc: float | None,
        dryw: float | None,
        peak: float | None,
        trough: float | None,
    ) -> None:
        """Transpiration (g/h) + dryback rate (%/h) from weight change."""
        now = dt_util.utcnow()
        last_ts = self.state.get("last_weight_ts")
        last_w = self.state.get("last_weight")
        self.state["last_weight"] = weight
        self.state["last_weight_ts"] = now.isoformat()
        if last_ts is None or last_w is None:
            return
        dt_h = (now - datetime.fromisoformat(last_ts)).total_seconds() / 3600
        if dt_h <= 0 or dt_h > 1:  # Lücke/Neustart ignorieren
            return
        rate = (last_w - weight) / dt_h  # >0 = weight loss (transpiration)
        rate = max(0.0, rate)            # negative values = irrigation -> 0
        # EMA-Glättung
        prev = self.state.get("ema_transpiration")
        ema = rate if prev is None else 0.3 * rate + 0.7 * prev
        self.state["ema_transpiration"] = ema
        data["transpiration_rate"] = round(ema, 1)

        # Dryback-Rate %/h relativ zur Spanne
        span = None
        if fc is not None and dryw is not None and fc > dryw:
            span = fc - dryw
        elif peak is not None and trough is not None and peak > trough:
            span = peak - trough
        if span:
            data["dryback_rate"] = round(ema / span * 100.0, 2)

    # ------------------------------------------------------------------ #
    # Energy integration
    # ------------------------------------------------------------------ #
    def _accumulate_energy(self) -> None:
        power_entities = self.entry.data.get(CONF_POWER_ENTITIES) or []
        if isinstance(power_entities, str):
            power_entities = [power_entities]
        now = dt_util.utcnow()
        last_ts = self.state.get("last_energy_ts")
        last = datetime.fromisoformat(last_ts) if last_ts else None
        dt_hours = (now - last).total_seconds() / 3600 if last else 0.0
        self.state["last_energy_ts"] = now.isoformat()

        if dt_hours <= 0 or dt_hours > 1:  # Lücke ignorieren (Neustart etc.)
            return
        for ent in power_entities:
            st = self.hass.states.get(ent)
            if st is None or st.state in ("unknown", "unavailable", ""):
                continue
            try:
                watts = float(st.state)
            except (ValueError, TypeError):
                continue
            prev = self.state["energy_kwh"].get(ent, 0.0)
            self.state["energy_kwh"][ent] = prev + watts / 1000.0 * dt_hours

    # ------------------------------------------------------------------ #
    # Main update
    # ------------------------------------------------------------------ #
    async def _async_update_data(self) -> dict[str, Any]:
        try:
            data = await self._compute_data()
        except Exception as err:  # noqa: BLE001
            raise UpdateFailed(f"Precision Grow update failed: {err}") from err
        # Per-cycle state mutations (energy accumulation, dryback peak/trough,
        # transpiration series, daily diary snapshot) are persisted debounced.
        self._schedule_state_save()
        return data

    async def _compute_data(self) -> dict[str, Any]:
        data: dict[str, Any] = {}
        phase = self.state["phase"]
        targets = self.phase_targets(phase)

        temp = self._float_state(CONF_SENSOR_TEMP)
        rh = self._float_state(CONF_SENSOR_HUMIDITY)
        weight = self._float_state(CONF_SENSOR_WEIGHT)
        reservoir = self._float_state(CONF_SENSOR_RESERVOIR)
        co2 = self._float_state(CONF_SENSOR_CO2)
        ppfd, ppfd_source = self._resolve_ppfd()
        ec = self._float_state(CONF_SENSOR_EC)
        ph = self._float_state(CONF_SENSOR_PH)
        water_temp = self._float_state(CONF_SENSOR_WATER_TEMP)

        leaf_offset = float(self._opt(CONF_LEAF_OFFSET, DEFAULT_LEAF_OFFSET))
        photoperiod = self.effective_photoperiod(phase)

        # --- Climate ---
        if temp is not None and rh is not None:
            vpd = calculate_vpd(temp, rh)
            lvpd = calculate_lvpd(temp, rh, leaf_offset)
            data["vpd"] = round(vpd, 2)
            data["lvpd"] = round(lvpd, 2)
            data["vpd_status"] = status_in_range(vpd, *targets["vpd"])
        data["temp"] = temp
        data["humidity"] = rh
        data["co2"] = co2
        if co2 is not None:
            data["co2_status"] = status_in_range(co2, 800, 1500)

        # --- DLI ---
        lo = calculate_dli(targets["ppfd"][0], photoperiod)
        hi = calculate_dli(targets["ppfd"][1], photoperiod)
        data["dli_target_min"] = round(lo, 1)
        data["dli_target_max"] = round(hi, 1)
        if ppfd is not None:
            dli = calculate_dli(ppfd, photoperiod)
            data["dli"] = round(dli, 2)
            data["dli_status"] = status_in_range(dli, lo, hi)
            data["dli_pct"] = round(min(100.0, dli / hi * 100), 0) if hi > 0 else 0
        data["ppfd"] = ppfd
        data["ppfd_source"] = ppfd_source
        data["brightness_pct"] = self._brightness_pct()
        data["brightness_target"] = PHASE_BRIGHTNESS.get(phase)

        # --- Dryback / weight / transpiration ---
        if weight is not None:
            today = dt_util.now().date().isoformat()
            if self.state.get("peak_day") != today:
                # Neuer Tag -> Peak/Trough resetten
                self.state["peak_day"] = today
                self.state["peak_weight"] = weight
                self.state["trough_weight"] = weight
            else:
                if self.state["peak_weight"] is None or weight > self.state["peak_weight"]:
                    self.state["peak_weight"] = weight
                if self.state["trough_weight"] is None or weight < self.state["trough_weight"]:
                    self.state["trough_weight"] = weight

            peak = self.state["peak_weight"]
            trough = self.state["trough_weight"]
            data["weight"] = weight

            # Field-capacity hybrid: prefer calibrated FC + dry weight
            fc = self.state.get("field_capacity")
            dryw = self.state.get("dry_weight")
            if fc is not None and dryw is not None and fc > dryw:
                dryback = max(0.0, min(100.0, (fc - weight) / (fc - dryw) * 100.0))
            else:
                dryback = calculate_dryback(weight, peak, trough)
            data["dryback_pct"] = round(dryback, 1)
            data["dryback_status"] = status_in_range(dryback, *targets["dryback_p3"])

            # Transpiration (g/h) + dryback rate (%/h) from weight time series
            self._update_transpiration(weight, data, fc, dryw, peak, trough)

            # Shot-Volume: gewichtsbasiertes Defizit (1g≈1mL) gegen FC, sonst %-Topf
            ref_fc = fc if fc is not None else peak
            if ref_fc is not None and ref_fc > weight:
                data["shot_volume"] = round(ref_fc - weight, 0)
            else:
                data["shot_volume"] = self._shot_volume_1pct()
        else:
            data["shot_volume"] = self._shot_volume_1pct()

        # --- P-phase (time of day) ---
        data["p_phase"] = self._p_phase(photoperiod)

        # --- Light status / progress ---
        data.update(self._light_status(photoperiod))

        # --- Runoff targets (mL) from pot size ---
        data["shot_volume_1pct"] = self._shot_volume_1pct()
        pot_ml = float(self._opt(CONF_CONTAINER_SIZE_ML, 3000) or 3000)
        data["runoff_target_veg"] = (
            round(pot_ml * RUNOFF_TARGET_VEG_PCT[0] / 100.0),
            round(pot_ml * RUNOFF_TARGET_VEG_PCT[1] / 100.0),
        )
        data["runoff_target_gen"] = (
            round(pot_ml * RUNOFF_TARGET_GEN_PCT[0] / 100.0),
            round(pot_ml * RUNOFF_TARGET_GEN_PCT[1] / 100.0),
        )

        # --- Reservoir (VL53L0X distance -> % -> L, or direct %) ---
        if reservoir is not None:
            d_empty = self.state.get("res_dist_empty")
            d_full = self.state.get("res_dist_full")
            if d_empty is not None and d_full is not None:
                pct = reservoir_pct_from_distance(reservoir, d_empty, d_full)
            else:
                pct = reservoir  # source already provides %
            if pct is not None:
                tank_l = float(self._opt(CONF_TANK_VOLUME_L, DEFAULT_TANK_VOLUME_L))
                data["reservoir_pct"] = round(pct, 1)
                data["reservoir_liters"] = round(pct / 100.0 * tank_l, 1)
                if pct < RESERVOIR_CRITICAL_PCT:
                    data["reservoir_status"] = "critical"
                elif pct < RESERVOIR_LOW_PCT:
                    data["reservoir_status"] = "low"
                else:
                    data["reservoir_status"] = "ok"

        # --- Nährstoffe (live) ---
        data["ec"] = ec
        data["ph"] = ph
        data["water_temp"] = water_temp

        # --- Growth ---
        data["phase"] = phase
        data["day_total"] = self._day_total()
        data["day_in_phase"] = self._day_in_phase()
        data["week_in_phase"] = (data["day_in_phase"] - 1) // 7 + 1 if data["day_in_phase"] else 0

        # Flower switch reminder (regular plants only)
        data["flower_switch_due"] = self._flower_switch_due()
        data["veg_days_effective"] = self.effective_veg_days()

        # Flower day + next training/harvest event
        flower_day = self._flower_day()
        data["flower_day"] = flower_day
        if flower_day is not None:
            flower_days_total = int(self._opt(CONF_FLOWER_DAYS, 63) or 63)
            evt = next_training_event(flower_day, flower_days_total)
            if evt:
                data["next_training_event"] = evt["event"]
                data["next_training_in_days"] = evt["in_days"]

        # --- Energy / cost ---
        self._accumulate_energy()
        total_kwh = sum(self.state["energy_kwh"].values())
        price = float(self._opt(CONF_POWER_PRICE, DEFAULT_POWER_PRICE))
        data["energy_total_kwh"] = round(total_kwh, 3)
        data["energy_cost_eur"] = round(total_kwh * price, 2)
        days = max(1, data["day_total"])
        data["daily_cost_eur"] = round(total_kwh * price / days, 2)
        data["energy_by_device"] = {
            k: round(v, 3) for k, v in self.state["energy_kwh"].items()
        }

        # --- Kosten pro Gramm (nach Harvest) ---
        harvest = self.state.get("harvest", {})
        dry = harvest.get("dry_g")
        if dry:
            extra = harvest.get("extra_cost", 0.0)
            total_cost = data["energy_cost_eur"] + extra
            data["cost_per_gram"] = round(total_cost / dry, 2) if dry else None

        # --- Runoff letzte Analyse ---
        if self.state["runoff_log"]:
            data["last_runoff"] = self.state["runoff_log"][-1]

        # --- Diary: update daily snapshot ---
        self._update_diary_snapshot(data)

        # --- Setup-Test Status ---
        data["test_status"] = (self.state.get("test_results") or {}).get("overall")

        # --- A/B comparison status ---
        comp = self.state.get("comparison")
        data["comparison_state"] = (
            f"{comp.get('a_label')} vs {comp.get('b_label')}" if comp else None
        )

        return data

    # ------------------------------------------------------------------ #
    # Diary
    # ------------------------------------------------------------------ #
    def _update_diary_snapshot(self, data: dict[str, Any]) -> None:
        """Create/update today's diary entry (value snapshot)."""
        today = dt_util.now().date().isoformat()
        diary = self.state.setdefault("diary", {})
        entry = diary.setdefault(
            today, {"date": today, "comment": "", "image": "", "snapshot": {}}
        )
        entry["snapshot"] = {
            "phase": data.get("phase"),
            "day_total": data.get("day_total"),
            "flower_day": data.get("flower_day"),
            "vpd": data.get("vpd"),
            "temp": data.get("temp"),
            "humidity": data.get("humidity"),
            "dryback_pct": data.get("dryback_pct"),
            "ec": data.get("ec"),
            "ph": data.get("ph"),
            "dli": data.get("dli"),
        }
        data["diary_count"] = len(diary)

    def diary_entries(self, limit: int = 30) -> list[dict[str, Any]]:
        """Diary entries, newest first."""
        diary = self.state.get("diary", {})
        return [diary[k] for k in sorted(diary, reverse=True)][:limit]

    async def async_set_text(self, key: str, value: str) -> None:
        self.state.setdefault("text_inputs", {})[key] = value
        await self.async_save_state()
        await self.async_request_refresh()

    async def async_save_diary_today(
        self, comment: str | None = None, image: str | None = None
    ) -> None:
        """Assign comment/image to today's diary entry."""
        texts = self.state.get("text_inputs", {})
        if comment is None:
            comment = texts.get(TEXT_DIARY_COMMENT, "")
        if image is None:
            image = texts.get(TEXT_DIARY_IMAGE, "")
        today = dt_util.now().date().isoformat()
        diary = self.state.setdefault("diary", {})
        entry = diary.setdefault(
            today, {"date": today, "comment": "", "image": "", "snapshot": {}}
        )
        entry["comment"] = comment
        entry["ts"] = dt_util.now().isoformat()
        if image:
            day = (entry.get("snapshot") or {}).get("day_total") or self._day_total()
            dest, thumb = await self.hass.async_add_executor_job(
                self._process_photo, image, day
            )
            entry["image"] = dest
            entry["thumb"] = thumb
        await self.hass.async_add_executor_job(self._write_diary_json)
        await self.async_save_state()
        await self.async_request_refresh()

    # ------------------------------------------------------------------ #
    # Service-Aktionen
    # ------------------------------------------------------------------ #
    async def async_set_phase(self, phase: str) -> None:
        self.state["phase"] = phase
        today = dt_util.now().date().isoformat()
        self.state["phase_changed_date"] = today
        # Blütebeginn beim Eintritt in Stretch festhalten
        if phase == PHASE_STRETCH and not self.state.get("flower_start_date"):
            self.state["flower_start_date"] = today
        await self.async_save_state()
        await self.async_request_refresh()

    async def async_calibrate_field_capacity(self) -> None:
        """Store the current weight as field capacity."""
        w = self._float_state(CONF_SENSOR_WEIGHT)
        if w is not None:
            self.state["field_capacity"] = w
            await self.async_save_state()
            await self.async_request_refresh()

    async def async_calibrate_dry_weight(self) -> None:
        """Store the current weight as dry weight."""
        w = self._float_state(CONF_SENSOR_WEIGHT)
        if w is not None:
            self.state["dry_weight"] = w
            await self.async_save_state()
            await self.async_request_refresh()

    async def async_calibrate_reservoir(self, point: str) -> None:
        """Calibrate reservoir distance. point = 'empty' | 'full'."""
        d = self._float_state(CONF_SENSOR_RESERVOIR)
        if d is None:
            return
        self.state["res_dist_empty" if point == "empty" else "res_dist_full"] = d
        await self.async_save_state()
        await self.async_request_refresh()

    async def async_log_runoff(
        self,
        runoff_ec: float,
        runoff_ph: float,
        volume_ml: float | None = None,
        ppm: float | None = None,
        note: str = "",
    ) -> None:
        """Save runoff measurement + compute recommendation."""
        input_ec = self._float_state(CONF_SENSOR_EC) or 0.0
        input_ph = self._float_state(CONF_SENSOR_PH) or 0.0
        week = min(12, max(1, (self._day_total() // 7) + 1))
        target_ec = self.nutrient_profile["ec_by_week"].get(week, 2.0)

        analysis = analyze_runoff(
            runoff_ec, input_ec, target_ec, runoff_ph, input_ph
        )
        entry = {
            "ts": dt_util.now().isoformat(),
            "runoff_ec": runoff_ec,
            "runoff_ph": runoff_ph,
            "input_ec": input_ec,
            "input_ph": input_ph,
            "target_ec": target_ec,
            "volume_ml": volume_ml,
            "ppm": ppm,
            "note": note,
            **analysis,
        }
        self.state["runoff_log"].append(entry)
        await self.async_save_state()
        await self.async_request_refresh()

    # ------------------------------------------------------------------ #
    # CSV-Export
    # ------------------------------------------------------------------ #
    _CSV_FIELDS = [
        "ts", "runoff_ec", "runoff_ph", "input_ec", "input_ph",
        "target_ec", "volume_ml", "ppm", "ec_trend", "ph_trend",
        "recommendation", "note",
    ]

    # ------------------------------------------------------------------ #
    # Storage layer (Synology mount / media)
    # ------------------------------------------------------------------ #
    @property
    def grow_slug(self) -> str:
        return slugify(self.entry.title or "grow")

    def summary_dict(self) -> dict[str, Any]:
        """Key-figure summary of this grow (for archive + comparison)."""
        data = self.data or {}
        harvest = self.state.get("harvest", {})
        return {
            "grow": self.entry.title,
            "strain": self.entry.data.get(CONF_STRAIN),
            "plant_type": self.entry.data.get(CONF_PLANT_TYPE),
            "day_total": self._day_total(),
            "phase": self.phase,
            "wet_g": harvest.get("wet_g"),
            "dry_g": harvest.get("dry_g"),
            "drying_loss_pct": harvest.get("drying_loss_pct"),
            "cost_eur": data.get("energy_cost_eur"),
            "cost_per_gram": data.get("cost_per_gram"),
            "diary_entries": len(self.state.get("diary", {})),
            "runoff_entries": len(self.state.get("runoff_log", [])),
        }

    def _allowed_roots(self) -> list[str]:
        """Filesystem roots the integration may read from / write to."""
        return [
            self.hass.config.path("media"),
            self.hass.config.path("www"),
            self.hass.config.path(),  # /config
            "/media",
            "/share",
        ]

    def _safe_media_root(self) -> str:
        """Sanitize the configured media base path (anti-traversal)."""
        configured = self.entry.data.get(CONF_MEDIA_PATH, DEFAULT_MEDIA_PATH)
        if _path_within(configured, self._allowed_roots()):
            return configured
        _LOGGER.warning(
            "Media path %s is outside allowed roots; using HA media folder",
            configured,
        )
        return self.hass.config.path("media")

    def _media_base(self) -> str:
        return os.path.join(self._safe_media_root(), self.grow_slug)

    def _media_dir(self) -> str:
        return os.path.join(self._media_base(), "media")

    def _archive_dir(self) -> str:
        return os.path.join(self._media_base(), "archive")

    def _thumb_dir(self) -> str:
        return self.hass.config.path("www", "precision_grow", self.grow_slug)

    def _ensure_dirs(self) -> bool:
        """Create folder structure. False if media path is not writable."""
        try:
            os.makedirs(self._media_dir(), exist_ok=True)
            os.makedirs(self._archive_dir(), exist_ok=True)
        except OSError as err:
            _LOGGER.debug("Media path not writable: %s", err)
            return False
        os.makedirs(self._thumb_dir(), exist_ok=True)
        return True

    async def async_ensure_dirs(self) -> None:
        await self.hass.async_add_executor_job(self._ensure_dirs)

    def _process_photo(self, src: str, day: int) -> tuple[str, str | None]:
        """Copy+rename photo into the grow media folder, thumbnail on the Pi.

        Returns (destination path, thumbnail /local URL or None).
        """
        path = src if os.path.isabs(src) else os.path.join(self._media_dir(), src)
        if not os.path.isfile(path):
            return src, None
        # Anti-exposure: only copy sources that live under an allowed root.
        if not _path_within(path, [*self._allowed_roots(), self._media_base()]):
            _LOGGER.warning("Diary image path %s outside allowed roots; ignored", src)
            return "", None
        ext = os.path.splitext(path)[1].lower() or ".jpg"
        name = f"{self.grow_slug}-tag-{day}{ext}"
        try:
            os.makedirs(self._media_dir(), exist_ok=True)
            dest = os.path.join(self._media_dir(), name)
            if os.path.abspath(path) != os.path.abspath(dest):
                shutil.copy2(path, dest)
        except OSError as err:
            _LOGGER.warning("Photo copy failed: %s", err)
            return src, None
        thumb_url: str | None = None
        try:
            from PIL import Image  # noqa: PLC0415

            os.makedirs(self._thumb_dir(), exist_ok=True)
            thumb_name = f"{self.grow_slug}-tag-{day}.jpg"
            thumb_path = os.path.join(self._thumb_dir(), thumb_name)
            img = Image.open(dest)
            img.thumbnail((400, 400))
            img.convert("RGB").save(thumb_path, "JPEG", quality=70)
            thumb_url = f"/local/precision_grow/{self.grow_slug}/{thumb_name}"
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning("Thumbnail failed: %s", err)
        return dest, thumb_url

    def _write_diary_json(self) -> None:
        """Write the diary as JSON to the media folder (best effort)."""
        try:
            os.makedirs(self._media_dir(), exist_ok=True)
            with open(
                os.path.join(self._media_dir(), "diary.json"), "w", encoding="utf-8"
            ) as fh:
                json.dump(self.state.get("diary", {}), fh, ensure_ascii=False, indent=2)
        except OSError as err:
            _LOGGER.debug("diary.json not writable: %s", err)

    def _archive_grow(self) -> str:
        """Copy the current grow (media + diary + summary) to the archive."""
        ts = dt_util.now().strftime("%Y%m%d_%H%M%S")
        dest = os.path.join(self._archive_dir(), f"{self.grow_slug}_{ts}")
        os.makedirs(dest, exist_ok=True)
        summary = {
            **self.summary_dict(),
            "start_date": self.entry.data.get(CONF_START_DATE),
            "archived": dt_util.now().isoformat(),
        }
        with open(os.path.join(dest, "summary.json"), "w", encoding="utf-8") as fh:
            json.dump(summary, fh, ensure_ascii=False, indent=2)
        with open(os.path.join(dest, "diary.json"), "w", encoding="utf-8") as fh:
            json.dump(self.state.get("diary", {}), fh, ensure_ascii=False, indent=2)
        # Also write the full configuration for later cloning
        config = {
            "title": self.entry.title,
            "data": dict(self.entry.data),
            "options": dict(self.entry.options),
        }
        with open(os.path.join(dest, "config.json"), "w", encoding="utf-8") as fh:
            json.dump(config, fh, ensure_ascii=False, indent=2)
        media = self._media_dir()
        if os.path.isdir(media):
            for f in os.listdir(media):
                fp = os.path.join(media, f)
                if os.path.isfile(fp):
                    shutil.copy2(fp, os.path.join(dest, f))
        return dest

    async def async_archive_grow(self) -> str:
        path = await self.hass.async_add_executor_job(self._archive_grow)
        pn_async_create(
            self.hass,
            f"Grow archived to: `{path}`",
            title=f"Precision Grow — Archive {self.entry.title}",
            notification_id=f"{DOMAIN}_archive_{self.entry.entry_id}",
        )
        return path

    # ------------------------------------------------------------------ #
    # A/B comparison
    # ------------------------------------------------------------------ #
    async def async_collect_compare_sources(self) -> dict[str, Any]:
        """Verfügbare Grows (aktiv + archiviert) als {label: summary} sammeln."""
        sources: dict[str, Any] = {}
        for e in self.hass.config_entries.async_entries(DOMAIN):
            coord = getattr(e, "runtime_data", None)
            if coord is not None:
                sources[f"Active: {e.title}"] = coord.summary_dict()
        media_path = self.entry.data.get(CONF_MEDIA_PATH, DEFAULT_MEDIA_PATH)
        archived = await self.hass.async_add_executor_job(
            _scan_archive_summaries, media_path
        )
        sources.update(archived)
        self._compare_sources = sources
        self.state["compare_labels"] = list(sources.keys())
        return sources

    async def async_set_compare(self, slot: str, label: str) -> None:
        """Store A/B selection (slot = 'a' | 'b')."""
        self.state[f"compare_{slot}"] = label
        await self.async_save_state()
        await self.async_request_refresh()

    async def async_compare(self) -> dict[str, Any] | None:
        """Ausgewählte Grows A/B vergleichen → Ergebnis + Notification."""
        sources = await self.async_collect_compare_sources()
        a_label = self.state.get("compare_a")
        b_label = self.state.get("compare_b")
        a, b = sources.get(a_label), sources.get(b_label)
        if not a or not b:
            return None
        fields = [
            ("dry_g", "Trockenertrag g", 1),
            ("cost_per_gram", "€/g", 1),
            ("cost_eur", "Kosten €", -1),
            ("day_total", "Dauer Tage", -1),
            ("drying_loss_pct", "Trocknungsverlust %", -1),
        ]
        rows = []
        for key, label, better in fields:
            va, vb = a.get(key), b.get(key)
            rows.append({"field": label, "a": va, "b": vb, "better": better})
        comparison = {
            "ts": dt_util.now().isoformat(),
            "a_label": a_label,
            "b_label": b_label,
            "a": a,
            "b": b,
            "rows": rows,
        }
        self.state["comparison"] = comparison
        lines = [f"**{a_label}** vs **{b_label}**", ""]
        for r in rows:
            lines.append(f"- {r['field']}: {r['a']} vs {r['b']}")
        pn_async_create(
            self.hass,
            "\n".join(lines),
            title=f"Precision Grow — Comparison {self.entry.title}",
            notification_id=f"{DOMAIN}_compare_{self.entry.entry_id}",
        )
        await self.async_save_state()
        await self.async_request_refresh()
        return comparison

    # ------------------------------------------------------------------ #
    # CSV-Export
    # ------------------------------------------------------------------ #
    def _write_csv(self) -> str:
        """Write runoff log + meta. Target: media folder, otherwise /config/www."""
        slug = self.grow_slug
        fname = f"precision_grow_{slug}.csv"
        use_media = True
        target_dir = self._media_dir()
        try:
            os.makedirs(target_dir, exist_ok=True)
        except OSError:
            use_media = False
            target_dir = self.hass.config.path("www")
            os.makedirs(target_dir, exist_ok=True)
        path = os.path.join(target_dir, fname)
        rows = self.state.get("runoff_log", [])
        harvest = self.state.get("harvest", {})
        with open(path, "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh)
            w.writerow(["# Precision Grow Export", self.entry.title])
            w.writerow(["# generated", dt_util.now().isoformat()])
            w.writerow(["# phase", self.phase, "day_total", self._day_total()])
            if harvest:
                w.writerow([
                    "# harvest_wet_g", harvest.get("wet_g"),
                    "dry_g", harvest.get("dry_g"),
                    "drying_loss_pct", harvest.get("drying_loss_pct"),
                ])
            w.writerow([])
            w.writerow(self._CSV_FIELDS)
            for r in rows:
                w.writerow([r.get(k, "") for k in self._CSV_FIELDS])
        return f"/local/{fname}" if not use_media else path

    async def async_export_and_notify(self) -> str:
        """Write CSV and create a persistent notification with a link."""
        path = await self.hass.async_add_executor_job(self._write_csv)
        msg = (
            f"CSV export ready: [{path}]({path})"
            if path.startswith("/local/")
            else f"CSV export saved: `{path}`"
        )
        pn_async_create(
            self.hass,
            msg,
            title=f"Precision Grow — Export {self.entry.title}",
            notification_id=f"{DOMAIN}_export_{self.entry.entry_id}",
        )
        return path

    # ------------------------------------------------------------------ #
    # Test my Setup — test & validate devices/sensors
    # ------------------------------------------------------------------ #
    def _device_test_plan(self) -> list[tuple]:
        """(label, device_conf, sensor_conf, richtung, schwelle, strikt)."""
        return [
            ("humidifier", CONF_DEVICE_HUMIDIFIER, CONF_SENSOR_HUMIDITY, "up", 1.5, True),
            ("dehumidifier", CONF_DEVICE_DEHUMIDIFIER, CONF_SENSOR_HUMIDITY, "down", 1.5, True),
            ("heater", CONF_DEVICE_HEATER, CONF_SENSOR_TEMP, "up", 0.3, True),
            ("cooler", CONF_DEVICE_COOLER, CONF_SENSOR_TEMP, "down", 0.3, True),
            ("exhaust", CONF_DEVICE_EXHAUST, CONF_SENSOR_HUMIDITY, "down", 1.0, False),
            ("co2_valve", CONF_DEVICE_CO2_VALVE, CONF_SENSOR_CO2, "up", 50, False),
        ]

    async def _set_device(self, entity_id: str, turn_on: bool) -> None:
        await self.hass.services.async_call(
            "homeassistant",
            "turn_on" if turn_on else "turn_off",
            {"entity_id": entity_id},
            blocking=True,
        )

    async def _auto_off(self, entity_id: str, _now: Any = None) -> None:
        """Safety fallback: force a device off (scheduled via async_call_later)."""
        await self._set_device(entity_id, False)

    async def _test_device(
        self,
        device_id: str,
        sensor_conf: str,
        direction: str,
        threshold: float,
        strict: bool,
        duration: int,
    ) -> dict[str, Any]:
        """Test one device: baseline -> on -> wait -> measure -> restore."""
        baseline = self._float_state(sensor_conf)
        if baseline is None:
            return {"result": "skipped", "reason": "no sensor"}
        prior = self.hass.states.get(device_id)
        was_on = prior is not None and prior.state == "on"
        # Safety watchdog: force-off shortly after the planned duration even if
        # this coroutine is interrupted (cancelled/reloaded) during the sleep.
        cancel_watchdog = async_call_later(
            self.hass, duration + 10, functools.partial(self._auto_off, device_id)
        )
        try:
            await self._set_device(device_id, True)
            await asyncio.sleep(duration)
            measure = self._float_state(sensor_conf)
        finally:
            cancel_watchdog()
            if not was_on:
                await self._set_device(device_id, False)
        if measure is None:
            return {"result": "fail", "reason": "sensor not readable", "baseline": baseline}
        delta = measure - baseline
        if direction == "up":
            ok = delta >= threshold
        else:
            ok = -delta >= threshold
        result = "pass" if ok else ("fail" if strict else "inconclusive")
        return {
            "result": result,
            "baseline": round(baseline, 2),
            "measure": round(measure, 2),
            "delta": round(delta, 2),
            "expected": direction,
        }

    async def async_test_setup(
        self, include_pump: bool = False, duration: int = 60
    ) -> dict[str, Any]:
        """Test and validate all mapped sensors/devices."""
        if self._test_running:
            return {"overall": "running"}
        self._test_running = True
        results: dict[str, Any] = {
            "ts": dt_util.now().isoformat(),
            "sensors": {},
            "devices": {},
        }
        try:
            # 1) Sensor-Erreichbarkeit
            sensor_map = {
                "temp": CONF_SENSOR_TEMP,
                "humidity": CONF_SENSOR_HUMIDITY,
                "weight": CONF_SENSOR_WEIGHT,
                "reservoir": CONF_SENSOR_RESERVOIR,
                "co2": CONF_SENSOR_CO2,
                "ppfd": CONF_SENSOR_PPFD,
                "ec": CONF_SENSOR_EC,
                "ph": CONF_SENSOR_PH,
            }
            for label, conf in sensor_map.items():
                if not self.entry.data.get(conf):
                    results["sensors"][label] = "not_configured"
                elif self._float_state(conf) is not None:
                    results["sensors"][label] = "ok"
                else:
                    results["sensors"][label] = "unreachable"

            # 2) Device tests
            for label, dev_conf, sen_conf, direction, thr, strict in self._device_test_plan():
                device_id = self.entry.data.get(dev_conf)
                if not device_id:
                    continue
                results["devices"][label] = await self._test_device(
                    device_id, sen_conf, direction, thr, strict, duration
                )

            # 3) Pump (optional, after confirmation)
            if include_pump:
                results["devices"]["pump"] = await self._test_pump_internal(duration)

            results["overall"] = self._test_overall(results)
            self.state["test_results"] = results
            await self.async_save_state()
            self._notify_test(results)
            await self.async_request_refresh()
            return results
        finally:
            self._test_running = False

    def _current_reservoir_pct(self) -> float | None:
        """Current reservoir level in % (calibrated ToF distance)."""
        raw = self._float_state(CONF_SENSOR_RESERVOIR)
        if raw is None:
            return None
        d_empty = self.state.get("res_dist_empty")
        d_full = self.state.get("res_dist_full")
        if d_empty is not None and d_full is not None:
            return reservoir_pct_from_distance(raw, d_empty, d_full)
        return raw  # source already provides %

    async def _test_pump_internal(self, duration: int) -> dict[str, Any]:
        """Run the pump briefly, validate via the falling reservoir level."""
        device_id = self.entry.data.get(CONF_DEVICE_PUMP)
        if not device_id:
            return {"result": "skipped", "reason": "no pump"}
        pct_before = self._current_reservoir_pct()
        weight_before = self._float_state(CONF_SENSOR_WEIGHT)
        prior = self.hass.states.get(device_id)
        was_on = prior is not None and prior.state == "on"
        run = min(duration, 30)
        # Safety watchdog: force the pump off even if interrupted mid-run
        # (flooding protection).
        cancel_watchdog = async_call_later(
            self.hass, run + 10, functools.partial(self._auto_off, device_id)
        )
        try:
            await self._set_device(device_id, True)
            await asyncio.sleep(run)
        finally:
            cancel_watchdog()
            if not was_on:
                await self._set_device(device_id, False)
        pct_after = self._current_reservoir_pct()
        weight_after = self._float_state(CONF_SENSOR_WEIGHT)

        detail: dict[str, Any] = {"run_seconds": run}
        # Primary: reservoir must have dropped -> pump is delivering
        if pct_before is not None and pct_after is not None:
            drop = round(pct_before - pct_after, 2)
            detail["reservoir_before"] = round(pct_before, 1)
            detail["reservoir_after"] = round(pct_after, 1)
            detail["reservoir_drop_pct"] = drop
            if drop >= 0.5:
                detail["result"] = "pass"
            elif drop > 0:
                detail["result"] = "inconclusive"  # Änderung zu klein/zu kurz
            else:
                detail["result"] = "fail"  # no water pumped
        else:
            detail["result"] = "ran"  # no reservoir sensor -> just executed
            detail["reason"] = "no level sensor"
        # Sekundär (optional): Topfgewicht als Zusatzinfo
        if weight_before is not None and weight_after is not None:
            detail["weight_delta"] = round(weight_after - weight_before, 2)
        return detail

    async def async_test_pump(self, duration: int = 15) -> dict[str, Any]:
        """Test only the pump (call after the safety confirmation)."""
        if self._test_running:
            return {"overall": "running"}
        self._test_running = True
        try:
            result = await self._test_pump_internal(duration)
            existing = self.state.get("test_results") or {
                "ts": dt_util.now().isoformat(), "sensors": {}, "devices": {}
            }
            existing.setdefault("devices", {})["pump"] = result
            existing["ts"] = dt_util.now().isoformat()
            existing["overall"] = self._test_overall(existing)
            self.state["test_results"] = existing
            await self.async_save_state()
            self._notify_test(existing)
            await self.async_request_refresh()
            return result
        finally:
            self._test_running = False

    @staticmethod
    def _test_overall(results: dict[str, Any]) -> str:
        devs = results.get("devices", {})
        sens = results.get("sensors", {})
        if any(d.get("result") == "fail" for d in devs.values()):
            return "fail"
        if any(v == "unreachable" for v in sens.values()) or any(
            d.get("result") == "inconclusive" for d in devs.values()
        ):
            return "warning"
        return "pass"

    def _notify_test(self, results: dict[str, Any]) -> None:
        lines = [f"**Overall: {results.get('overall', '?').upper()}**", ""]
        for label, state in results.get("sensors", {}).items():
            lines.append(f"- Sensor {label}: {state}")
        for label, d in results.get("devices", {}).items():
            extra = f" (Δ {d.get('delta')})" if "delta" in d else ""
            lines.append(f"- {label}: {d.get('result')}{extra}")
        pn_async_create(
            self.hass,
            "\n".join(lines),
            title=f"Precision Grow — Setup test {self.entry.title}",
            notification_id=f"{DOMAIN}_test_{self.entry.entry_id}",
        )

    async def async_set_harvest(
        self, wet_g: float, dry_g: float, extra_cost: float = 0.0
    ) -> None:
        loss = 0.0
        if wet_g:
            loss = round((wet_g - dry_g) / wet_g * 100.0, 1)
        self.state["harvest"] = {
            "wet_g": wet_g,
            "dry_g": dry_g,
            "extra_cost": extra_cost,
            "drying_loss_pct": loss,
        }
        await self.async_save_state()
        await self.async_request_refresh()


def _path_within(path: str, roots: list[str]) -> bool:
    """True if `path` resolves inside any of the given allowed roots."""
    try:
        rp = os.path.realpath(path)
    except OSError:
        return False
    for root in roots:
        if not root:
            continue
        try:
            root_rp = os.path.realpath(root)
            if os.path.commonpath([rp, root_rp]) == root_rp:
                return True
        except (ValueError, OSError):
            continue
    return False


def _scan_archive_summaries(media_path: str) -> dict[str, Any]:
    """Find archive summaries: {label: summary} from summary.json."""
    found: dict[str, Any] = {}
    if not media_path:
        return found
    pattern = os.path.join(media_path, "*", "archive", "*", "summary.json")
    for path in glob.glob(pattern):
        try:
            with open(path, encoding="utf-8") as fh:
                summary = json.load(fh)
        except (OSError, ValueError):
            continue
        title = summary.get("grow", "Grow")
        stamp = os.path.basename(os.path.dirname(path))
        found[f"Archive: {title} ({stamp})"] = summary
    return found
