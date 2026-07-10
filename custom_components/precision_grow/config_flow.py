"""Config flow for Precision Grow — 6-step setup wizard (UI-first)."""
from __future__ import annotations

from datetime import date, timedelta
import glob
import json
import logging
import os
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.util import slugify

from .const import (
    CONF_CBD,
    CONF_CONTAINER_SIZE_ML,
    CONF_CONTAINER_TYPE,
    CONF_DEVICE_CO2_VALVE,
    CONF_DEVICE_COOLER,
    CONF_DEVICE_DEHUMIDIFIER,
    CONF_DEVICE_EXHAUST,
    CONF_DEVICE_HEATER,
    CONF_DEVICE_HUMIDIFIER,
    CONF_DEVICE_LIGHT,
    CONF_DEVICE_PUMP,
    CONF_DIARY_ENABLED,
    CONF_GROW_NAME,
    CONF_LEAF_OFFSET,
    CONF_LIGHTS_ON,
    CONF_MEDIA_PATH,
    CONF_NOTIFY_TARGET,
    CONF_NUTRIENT_PRESET,
    CONF_PHOTOPERIOD,
    CONF_PHOTO_TARGET,
    CONF_PLANT_AGE_DAYS,
    CONF_PLANT_COUNT,
    CONF_PLANT_TYPE,
    CONF_POWER_ENTITIES,
    CONF_POWER_PRICE,
    CONF_PROPAGATION,
    CONF_SENSOR_CO2,
    CONF_SENSOR_EC,
    CONF_SENSOR_BRIGHTNESS,
    CONF_SENSOR_HUMIDITY,
    CONF_SENSOR_PH,
    CONF_SENSOR_PPFD,
    CONF_SENSOR_RESERVOIR,
    CONF_SENSOR_SUBSTRATE_EC,
    CONF_SENSOR_SUBSTRATE_TEMP,
    CONF_SENSOR_TEMP,
    CONF_SENSOR_VWC,
    CONF_SENSOR_WATER_TEMP,
    CONF_SENSOR_WEIGHT,
    CONF_START_DATE,
    CONF_STRAIN,
    CONF_STRAIN_CUSTOM,
    CONF_STRAIN_TYPE,
    CONF_SUBSTRATE,
    CONF_TANK_VOLUME_L,
    CONF_THC,
    CONF_VEG_DAYS,
    CONF_FLOWER_DAYS,
    DEFAULT_LEAF_OFFSET,
    DEFAULT_LIGHTS_ON,
    DEFAULT_MEDIA_PATH,
    DEFAULT_NAME,
    DEFAULT_PHOTOPERIOD,
    DEFAULT_PLANT_AGE_DAYS,
    DEFAULT_PLANT_COUNT,
    DEFAULT_POWER_PRICE,
    DEFAULT_TANK_VOLUME_L,
    DOMAIN,
    NUTRIENT_PRESETS,
    PHASE_TARGETS,
    PHASES,
    PHOTO_TARGETS,
    PLANT_TYPES,
    POT_SIZES_ML,
    PROPAGATION_TYPES,
    ROCKWOOL_TYPES,
    STRAIN_TYPES,
    SUBSTRATES,
)
from .strain_api import async_lookup_strain

# Container options (pots + rockwool + custom)
_CONTAINER_OPTIONS = [*POT_SIZES_ML.keys(), *ROCKWOOL_TYPES, "custom"]


def _select(options: list[str], translation_key: str) -> selector.SelectSelector:
    """Translatable dropdown selector."""
    return selector.SelectSelector(
        selector.SelectSelectorConfig(
            options=options,
            mode=selector.SelectSelectorMode.DROPDOWN,
            translation_key=translation_key,
        )
    )


_LOGGER = logging.getLogger(__name__)


def _scan_archives(bases: list[str]) -> dict[str, dict[str, Any]]:
    """Find archived grows (config.json) in the media base paths."""
    found: dict[str, dict[str, Any]] = {}
    for base in bases:
        if not base:
            continue
        pattern = os.path.join(base, "*", "archive", "*", "config.json")
        for cfg_path in glob.glob(pattern):
            try:
                with open(cfg_path, encoding="utf-8") as fh:
                    cfg = json.load(fh)
            except (OSError, ValueError) as err:
                _LOGGER.debug("Archive config not readable %s: %s", cfg_path, err)
                continue
            title = cfg.get("title", "Grow")
            stamp = os.path.basename(os.path.dirname(cfg_path))
            found[f"archive:{cfg_path}"] = {
                "_label": f"Archive: {title} ({stamp})",
                "title": title,
                "data": cfg.get("data", {}),
                "options": cfg.get("options", {}),
            }
    return found


def _entity(domains: list[str] | None = None) -> selector.EntitySelector:
    """Optional entity selector, optionally limited to domains."""
    cfg = selector.EntitySelectorConfig(multiple=False)
    if domains:
        cfg = selector.EntitySelectorConfig(domain=domains, multiple=False)
    return selector.EntitySelector(cfg)


class PrecisionGrowConfigFlow(ConfigFlow, domain=DOMAIN):
    """6-step wizard."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._strain: dict[str, Any] = {}
        self._clone_sources: dict[str, dict[str, Any]] = {}
        self._clone_config: dict[str, Any] = {}

    # ----- Start: new or clone ------------------------------------------ #
    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self.async_show_menu(step_id="user", menu_options=["new", "clone"])

    # ----- Clone: choose source ----------------------------------------- #
    async def async_step_clone(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        # Collect active grows in the event loop, scan archives in the executor
        active: dict[str, dict[str, Any]] = {}
        bases: set[str] = {DEFAULT_MEDIA_PATH}
        for e in self.hass.config_entries.async_entries(DOMAIN):
            active[f"entry:{e.entry_id}"] = {
                "_label": f"Active: {e.title}",
                "title": e.title,
                "data": dict(e.data),
                "options": dict(e.options),
            }
            bases.add(e.data.get(CONF_MEDIA_PATH, DEFAULT_MEDIA_PATH))
        archived = await self.hass.async_add_executor_job(_scan_archives, list(bases))
        self._clone_sources = {**active, **archived}
        if not self._clone_sources:
            return self.async_abort(reason="no_clone_sources")

        if user_input is not None:
            self._clone_config = self._clone_sources.get(user_input["source"], {})
            return await self.async_step_clone_finish()

        options = [
            {"value": key, "label": src.get("_label", key)}
            for key, src in self._clone_sources.items()
        ]
        schema = vol.Schema(
            {
                vol.Required("source"): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=options, mode=selector.SelectSelectorMode.DROPDOWN
                    )
                )
            }
        )
        return self.async_show_form(step_id="clone", data_schema=schema)

    # ----- Clone: new name + start -------------------------------------- #
    async def async_step_clone_finish(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        src_data = dict(self._clone_config.get("data", {}))
        src_options = dict(self._clone_config.get("options", {}))
        src_title = self._clone_config.get("title", DEFAULT_NAME)

        errors: dict[str, str] = {}
        if user_input is not None:
            error = self._validate_grow_name(user_input[CONF_GROW_NAME])
            if error:
                errors[CONF_GROW_NAME] = error
            else:
                data = dict(src_data)
                data[CONF_GROW_NAME] = user_input[CONF_GROW_NAME]
                data[CONF_PROPAGATION] = user_input[CONF_PROPAGATION]
                data[CONF_PLANT_AGE_DAYS] = user_input[CONF_PLANT_AGE_DAYS]
                age = int(user_input[CONF_PLANT_AGE_DAYS] or 0)
                data[CONF_START_DATE] = (
                    date.today() - timedelta(days=age)
                ).isoformat()
                return self.async_create_entry(
                    title=user_input[CONF_GROW_NAME],
                    data=data,
                    options=src_options,
                )

        schema = vol.Schema(
            {
                vol.Required(
                    CONF_GROW_NAME, default=f"{src_title} Copy"
                ): str,
                vol.Required(CONF_PROPAGATION, default="seed"): _select(
                    PROPAGATION_TYPES, "propagation"
                ),
                vol.Required(
                    CONF_PLANT_AGE_DAYS, default=DEFAULT_PLANT_AGE_DAYS
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=365, step=1,
                        unit_of_measurement="d",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
            }
        )
        return self.async_show_form(
            step_id="clone_finish",
            data_schema=schema,
            errors=errors,
            description_placeholders={
                "source": src_title,
                "strain": src_data.get(CONF_STRAIN, "—"),
            },
        )

    # ----- Step 1: basics (new grow) ------------------------------------ #
    def _validate_grow_name(self, name: str) -> str | None:
        """Guard against duplicate/empty title slugs.

        The title slug becomes the entity-ID prefix; a duplicate would make
        HA suffix the new grow's object IDs with _2 and silently break
        dashboards.
        """
        slug = slugify(name or "")
        if not slug:
            return "invalid_name"
        for entry in self._async_current_entries(include_ignore=False):
            if slugify(entry.title) == slug:
                return "name_exists"
        return None

    async def async_step_new(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            error = self._validate_grow_name(user_input[CONF_GROW_NAME])
            if error:
                errors[CONF_GROW_NAME] = error
            else:
                self._data.update(user_input)
                return await self.async_step_strain()

        schema = vol.Schema(
            {
                vol.Required(CONF_GROW_NAME, default=DEFAULT_NAME): str,
                vol.Required(CONF_PROPAGATION, default="seed"): _select(
                    PROPAGATION_TYPES, "propagation"
                ),
                vol.Required(
                    CONF_PLANT_AGE_DAYS, default=DEFAULT_PLANT_AGE_DAYS
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=365, step=1,
                        unit_of_measurement="d",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
                vol.Required(
                    CONF_PLANT_COUNT, default=DEFAULT_PLANT_COUNT
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=1, max=100, step=1, mode=selector.NumberSelectorMode.BOX
                    )
                ),
                vol.Required(CONF_SUBSTRATE, default="coco"): _select(
                    SUBSTRATES, "substrate"
                ),
                vol.Required(CONF_CONTAINER_TYPE, default="3L_pot"): _select(
                    _CONTAINER_OPTIONS, "container"
                ),
                vol.Optional(
                    CONF_CONTAINER_SIZE_ML, default=3000
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=100, max=50000, step=100,
                        unit_of_measurement="mL",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
                vol.Required(CONF_LIGHTS_ON, default=DEFAULT_LIGHTS_ON): (
                    selector.TimeSelector()
                ),
                vol.Required(
                    CONF_POWER_PRICE, default=DEFAULT_POWER_PRICE
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=2, step=0.01,
                        unit_of_measurement="€/kWh",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
            }
        )
        return self.async_show_form(
            step_id="new", data_schema=schema, errors=errors
        )

    # ----- Step 1b: strain search --------------------------------------- #
    async def async_step_strain(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            name = user_input.get(CONF_STRAIN, "").strip()
            self._data[CONF_STRAIN] = name
            if user_input.get(CONF_STRAIN_CUSTOM) or not name:
                self._strain = {}
            else:
                self._strain = await async_lookup_strain(self.hass, name)
            return await self.async_step_strain_confirm()

        schema = vol.Schema(
            {
                vol.Optional(CONF_STRAIN, default=""): str,
                vol.Required(CONF_STRAIN_CUSTOM, default=False): bool,
            }
        )
        return self.async_show_form(step_id="strain", data_schema=schema)

    # ----- Step 1c: confirm strain / timing ----------------------------- #
    async def async_step_strain_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_nutrients()

        s = self._strain
        found = s.get("found")
        stype = s.get("strain_type", "hybrid")
        description = (
            f"Found via {s.get('source', '–')}. Review/adjust the values."
            if found
            else "Not found — please enter values manually from the seed packet."
        )
        schema = vol.Schema(
            {
                vol.Required(CONF_STRAIN_TYPE, default=stype): _select(
                    STRAIN_TYPES, "strain_type"
                ),
                vol.Required(
                    CONF_PLANT_TYPE, default=s.get("plant_type", "regular")
                ): _select(PLANT_TYPES, "plant_type"),
                vol.Required(
                    CONF_VEG_DAYS, default=s.get("veg_days", 28)
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=120, step=1, unit_of_measurement="d",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
                vol.Required(
                    CONF_FLOWER_DAYS, default=s.get("flower_days", 63)
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=150, step=1, unit_of_measurement="d",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
                vol.Optional(
                    CONF_THC, default=s.get("thc") or 0
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=40, step=0.1, unit_of_measurement="%",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
                vol.Optional(
                    CONF_CBD, default=s.get("cbd") or 0
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=30, step=0.1, unit_of_measurement="%",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
            }
        )
        return self.async_show_form(
            step_id="strain_confirm",
            data_schema=schema,
            description_placeholders={"info": description},
        )

    # ----- Step 2: nutrient profile ------------------------------------- #
    async def async_step_nutrients(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_sensors()

        schema = vol.Schema(
            {
                vol.Required(CONF_NUTRIENT_PRESET, default="lucas_coco"): _select(
                    NUTRIENT_PRESETS, "nutrient_preset"
                ),
            }
        )
        return self.async_show_form(step_id="nutrients", data_schema=schema)

    # ----- Step 3: sensor mapping --------------------------------------- #
    async def async_step_sensors(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_devices()

        schema = vol.Schema(
            {
                vol.Optional(CONF_SENSOR_TEMP): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_HUMIDITY): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_WEIGHT): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_VWC): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_SUBSTRATE_EC): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_SUBSTRATE_TEMP): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_RESERVOIR): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_CO2): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_PPFD): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_EC): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_PH): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_WATER_TEMP): _entity(["sensor"]),
                vol.Optional(CONF_SENSOR_BRIGHTNESS): _entity(["light", "sensor", "number"]),
                vol.Required(
                    CONF_TANK_VOLUME_L, default=DEFAULT_TANK_VOLUME_L
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=1, max=1000, step=1,
                        unit_of_measurement="L",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
            }
        )
        return self.async_show_form(step_id="sensors", data_schema=schema)

    # ----- Step 4: device mapping --------------------------------------- #
    async def async_step_devices(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_power()

        schema = vol.Schema(
            {
                vol.Optional(CONF_DEVICE_HEATER): _entity(["switch", "climate"]),
                vol.Optional(CONF_DEVICE_COOLER): _entity(["switch", "climate"]),
                vol.Optional(CONF_DEVICE_HUMIDIFIER): _entity(["switch", "humidifier"]),
                vol.Optional(CONF_DEVICE_DEHUMIDIFIER): _entity(["switch", "humidifier"]),
                vol.Optional(CONF_DEVICE_PUMP): _entity(["switch"]),
                vol.Optional(CONF_DEVICE_LIGHT): _entity(["switch", "light"]),
                vol.Optional(CONF_DEVICE_EXHAUST): _entity(["switch", "fan"]),
                vol.Optional(CONF_DEVICE_CO2_VALVE): _entity(["switch"]),
            }
        )
        return self.async_show_form(step_id="devices", data_schema=schema)

    # ----- Step 5: power meters ----------------------------------------- #
    async def async_step_power(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_storage()

        schema = vol.Schema(
            {
                vol.Optional(CONF_POWER_ENTITIES): selector.EntitySelector(
                    selector.EntitySelectorConfig(
                        domain="sensor",
                        device_class="power",
                        multiple=True,
                    )
                ),
            }
        )
        return self.async_show_form(step_id="power", data_schema=schema)

    # ----- Step 6: storage ---------------------------------------------- #
    async def async_step_storage(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            # Derive start date from plant age (day 1 = germination/cut)
            age = int(self._data.get(CONF_PLANT_AGE_DAYS, 0) or 0)
            self._data[CONF_START_DATE] = (
                date.today() - timedelta(days=age)
            ).isoformat()
            return self.async_create_entry(
                title=self._data.get(CONF_GROW_NAME, DEFAULT_NAME),
                data=self._data,
            )

        schema = vol.Schema(
            {
                vol.Required(CONF_PHOTO_TARGET, default="ha_media"): _select(
                    PHOTO_TARGETS, "photo_target"
                ),
                vol.Required(CONF_MEDIA_PATH, default=DEFAULT_MEDIA_PATH): str,
                vol.Required(CONF_DIARY_ENABLED, default=True): bool,
            }
        )
        return self.async_show_form(step_id="storage", data_schema=schema)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> PrecisionGrowOptionsFlow:
        return PrecisionGrowOptionsFlow(config_entry)


CONF_PHASE_TARGETS = "phase_targets"

# Editierbare Zielwert-Felder je Phase: (key, label-suffix, min, max, step, unit)
_TARGET_FIELDS = [
    ("temp_day", 0, 40, 0.1, "°C"),
    ("rh", 0, 100, 1, "%"),
    ("vpd", 0, 3, 0.1, "kPa"),
    ("ppfd", 0, 1500, 10, "µmol/m²/s"),
    ("dryback_p3", 0, 80, 1, "%"),
]


def _num(min_v, max_v, step, unit):
    return selector.NumberSelector(
        selector.NumberSelectorConfig(
            min=min_v, max=max_v, step=step,
            unit_of_measurement=unit, mode=selector.NumberSelectorMode.BOX,
        )
    )


class PrecisionGrowOptionsFlow(OptionsFlow):
    """Optionen — Allgemein + Phasen-Zielwert-Editor."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        self.config_entry = config_entry
        self._phase: str | None = None

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="init", menu_options=["general", "targets"]
        )

    # ----- Allgemeine Optionen ------------------------------------------- #
    async def async_step_general(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            new_options = {**self.config_entry.options, **user_input}
            return self.async_create_entry(title="", data=new_options)

        opts = self.config_entry.options
        data = self.config_entry.data
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_PHOTOPERIOD,
                    default=opts.get(CONF_PHOTOPERIOD, DEFAULT_PHOTOPERIOD),
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=24, step=0.5,
                        unit_of_measurement="h",
                        mode=selector.NumberSelectorMode.SLIDER,
                    )
                ),
                vol.Required(
                    CONF_LEAF_OFFSET,
                    default=opts.get(CONF_LEAF_OFFSET, DEFAULT_LEAF_OFFSET),
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=6, step=0.5,
                        unit_of_measurement="°C",
                        mode=selector.NumberSelectorMode.SLIDER,
                    )
                ),
                vol.Required(
                    CONF_POWER_PRICE,
                    default=opts.get(
                        CONF_POWER_PRICE,
                        data.get(CONF_POWER_PRICE, DEFAULT_POWER_PRICE),
                    ),
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(
                        min=0, max=2, step=0.01,
                        unit_of_measurement="€/kWh",
                        mode=selector.NumberSelectorMode.BOX,
                    )
                ),
                vol.Optional(
                    CONF_NOTIFY_TARGET,
                    default=opts.get(CONF_NOTIFY_TARGET, ""),
                ): selector.TextSelector(),
            }
        )
        return self.async_show_form(step_id="general", data_schema=schema)

    # ----- Phasen-Zielwerte: Phase wählen -------------------------------- #
    async def async_step_targets(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._phase = user_input["phase"]
            return await self.async_step_edit_targets()

        schema = vol.Schema(
            {vol.Required("phase", default=PHASES[0]): _select(PHASES, "phase")}
        )
        return self.async_show_form(step_id="targets", data_schema=schema)

    # ----- Phasen-Zielwerte: editieren ----------------------------------- #
    async def async_step_edit_targets(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        phase = self._phase or PHASES[0]
        current = dict(PHASE_TARGETS.get(phase, {}))
        override = (self.config_entry.options.get(CONF_PHASE_TARGETS) or {}).get(phase, {})
        current.update(override)

        if user_input is not None:
            new_targets = {}
            for key, *_ in _TARGET_FIELDS:
                new_targets[key] = (
                    user_input[f"{key}_min"],
                    user_input[f"{key}_max"],
                )
            existing = dict(self.config_entry.options)
            pt = dict(existing.get(CONF_PHASE_TARGETS) or {})
            pt[phase] = new_targets
            existing[CONF_PHASE_TARGETS] = pt
            return self.async_create_entry(title="", data=existing)

        fields: dict = {}
        for key, mn, mx, st, unit in _TARGET_FIELDS:
            lo, hi = current.get(key, (mn, mx))
            fields[vol.Required(f"{key}_min", default=lo)] = _num(mn, mx, st, unit)
            fields[vol.Required(f"{key}_max", default=hi)] = _num(mn, mx, st, unit)

        return self.async_show_form(
            step_id="edit_targets",
            data_schema=vol.Schema(fields),
            description_placeholders={"phase": phase},
        )
