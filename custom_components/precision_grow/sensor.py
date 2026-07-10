"""Calculated sensors for Precision Grow."""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import (
    PERCENTAGE,
    UnitOfEnergy,
    UnitOfMass,
    UnitOfTemperature,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import PrecisionGrowConfigEntry
from .coordinator import PrecisionGrowCoordinator
from .entity import PrecisionGrowEntity


@dataclass(frozen=True, kw_only=True)
class PGSensorDescription(SensorEntityDescription):
    """Sensor description with a value function from coordinator.data."""

    value_fn: Callable[[dict[str, Any]], Any]
    attrs_fn: Callable[[PrecisionGrowCoordinator], dict[str, Any]] | None = None


SENSORS: tuple[PGSensorDescription, ...] = (
    # --- Climate (passed through for a self-contained dashboard) ---
    PGSensorDescription(
        key="temperature",
        translation_key="temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=SensorDeviceClass.TEMPERATURE,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("temp"),
    ),
    PGSensorDescription(
        key="humidity",
        translation_key="humidity",
        native_unit_of_measurement="%",
        device_class=SensorDeviceClass.HUMIDITY,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("humidity"),
    ),
    PGSensorDescription(
        key="co2",
        translation_key="co2",
        native_unit_of_measurement="ppm",
        device_class=SensorDeviceClass.CO2,
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda d: d.get("co2"),
    ),
    PGSensorDescription(
        key="ppfd",
        translation_key="ppfd",
        native_unit_of_measurement="µmol/m²/s",
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:brightness-7",
        value_fn=lambda d: d.get("ppfd"),
        attrs_fn=lambda c: {"source": (c.data or {}).get("ppfd_source")},
    ),
    PGSensorDescription(
        key="brightness_pct",
        translation_key="brightness_pct",
        native_unit_of_measurement="%",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        icon="mdi:brightness-percent",
        value_fn=lambda d: d.get("brightness_pct"),
        attrs_fn=lambda c: {"target": (c.data or {}).get("brightness_target")},
    ),
    # --- Klima ---
    PGSensorDescription(
        key="vpd",
        translation_key="vpd",
        native_unit_of_measurement="kPa",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:water-percent",
        value_fn=lambda d: d.get("vpd"),
    ),
    PGSensorDescription(
        key="lvpd",
        translation_key="lvpd",
        native_unit_of_measurement="kPa",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:leaf",
        value_fn=lambda d: d.get("lvpd"),
    ),
    PGSensorDescription(
        key="vpd_status",
        translation_key="vpd_status",
        device_class=SensorDeviceClass.ENUM,
        options=["optimal", "high", "low"],
        icon="mdi:check-circle",
        value_fn=lambda d: d.get("vpd_status"),
    ),
    PGSensorDescription(
        key="dli",
        translation_key="dli",
        native_unit_of_measurement="mol/m²/d",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:white-balance-sunny",
        value_fn=lambda d: d.get("dli"),
        attrs_fn=lambda c: {
            "target_min": (c.data or {}).get("dli_target_min"),
            "target_max": (c.data or {}).get("dli_target_max"),
            "percent_of_target": (c.data or {}).get("dli_pct"),
        },
    ),
    PGSensorDescription(
        key="dli_status",
        translation_key="dli_status",
        device_class=SensorDeviceClass.ENUM,
        options=["optimal", "high", "low"],
        icon="mdi:sun-wireless",
        value_fn=lambda d: d.get("dli_status"),
    ),
    PGSensorDescription(
        key="co2_status",
        translation_key="co2_status",
        device_class=SensorDeviceClass.ENUM,
        options=["optimal", "high", "low"],
        icon="mdi:molecule-co2",
        value_fn=lambda d: d.get("co2_status"),
    ),
    # --- Substrate / irrigation ---
    PGSensorDescription(
        key="dryback_pct",
        translation_key="dryback_pct",
        native_unit_of_measurement="%",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:water-minus",
        value_fn=lambda d: d.get("dryback_pct"),
    ),
    PGSensorDescription(
        key="dryback_status",
        translation_key="dryback_status",
        device_class=SensorDeviceClass.ENUM,
        options=["optimal", "high", "low"],
        icon="mdi:water-check",
        value_fn=lambda d: d.get("dryback_status"),
    ),
    PGSensorDescription(
        key="weight",
        translation_key="weight",
        native_unit_of_measurement=UnitOfMass.GRAMS,
        device_class=SensorDeviceClass.WEIGHT,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:scale",
        value_fn=lambda d: d.get("weight"),
    ),
    # --- Reservoir ---
    PGSensorDescription(
        key="reservoir_pct",
        translation_key="reservoir_pct",
        native_unit_of_measurement="%",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:cup-water",
        value_fn=lambda d: d.get("reservoir_pct"),
    ),
    PGSensorDescription(
        key="reservoir_status",
        translation_key="reservoir_status",
        device_class=SensorDeviceClass.ENUM,
        options=["ok", "low", "critical"],
        icon="mdi:water-alert",
        value_fn=lambda d: d.get("reservoir_status"),
    ),
    # --- Nutrients (live) ---
    PGSensorDescription(
        key="ec",
        translation_key="ec",
        native_unit_of_measurement="mS/cm",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:lightning-bolt-circle",
        value_fn=lambda d: d.get("ec"),
    ),
    PGSensorDescription(
        key="ph",
        translation_key="ph",
        device_class=SensorDeviceClass.PH,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:ph",
        value_fn=lambda d: d.get("ph"),
    ),
    PGSensorDescription(
        key="water_temp",
        translation_key="water_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        device_class=SensorDeviceClass.TEMPERATURE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:coolant-temperature",
        value_fn=lambda d: d.get("water_temp"),
    ),
    # --- Wachstum ---
    PGSensorDescription(
        key="phase",
        translation_key="phase",
        device_class=SensorDeviceClass.ENUM,
        options=["clone", "veg", "stretch", "bulk", "ripen", "drying"],
        icon="mdi:sprout",
        value_fn=lambda d: d.get("phase"),
    ),
    PGSensorDescription(
        key="day_total",
        translation_key="day_total",
        native_unit_of_measurement="d",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:calendar-range",
        value_fn=lambda d: d.get("day_total"),
    ),
    # --- Nutrient recommendation ---
    PGSensorDescription(
        key="nutrient_recommendation",
        translation_key="nutrient_recommendation",
        device_class=SensorDeviceClass.ENUM,
        options=[
            "increase_ec",
            "keep_ec",
            "reduce_ec",
            "flush",
            "check_roots",
        ],
        icon="mdi:flask",
        value_fn=lambda d: (d.get("last_runoff") or {}).get("recommendation"),
        attrs_fn=lambda c: (c.data or {}).get("last_runoff") or {},
    ),
    # --- Irrigation / substrate (extended) ---
    PGSensorDescription(
        key="dryback_rate",
        translation_key="dryback_rate",
        native_unit_of_measurement="%/h",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:trending-down",
        value_fn=lambda d: d.get("dryback_rate"),
    ),
    PGSensorDescription(
        key="transpiration_rate",
        translation_key="transpiration_rate",
        native_unit_of_measurement="g/h",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:water-sync",
        value_fn=lambda d: d.get("transpiration_rate"),
    ),
    PGSensorDescription(
        key="p_phase",
        translation_key="p_phase",
        device_class=SensorDeviceClass.ENUM,
        options=["P0", "P1", "P2", "P3"],
        icon="mdi:clock-time-four",
        value_fn=lambda d: d.get("p_phase"),
    ),
    PGSensorDescription(
        key="shot_volume",
        translation_key="shot_volume",
        native_unit_of_measurement="mL",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        icon="mdi:cup-water",
        value_fn=lambda d: d.get("shot_volume"),
        attrs_fn=lambda c: {
            "shot_volume_1pct": (c.data or {}).get("shot_volume_1pct"),
            "runoff_target_veg_ml": (c.data or {}).get("runoff_target_veg"),
            "runoff_target_gen_ml": (c.data or {}).get("runoff_target_gen"),
        },
    ),
    # --- Wachstum (erweitert) ---
    PGSensorDescription(
        key="day_in_phase",
        translation_key="day_in_phase",
        native_unit_of_measurement="d",
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:calendar-today",
        value_fn=lambda d: d.get("day_in_phase"),
    ),
    PGSensorDescription(
        key="week_in_phase",
        translation_key="week_in_phase",
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:calendar-week",
        value_fn=lambda d: d.get("week_in_phase"),
    ),
    PGSensorDescription(
        key="flower_day",
        translation_key="flower_day",
        native_unit_of_measurement="d",
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:flower",
        value_fn=lambda d: d.get("flower_day"),
    ),
    PGSensorDescription(
        key="next_training_event",
        translation_key="next_training_event",
        device_class=SensorDeviceClass.ENUM,
        options=[
            "lollipopping",
            "defoliation_1",
            "defoliation_2",
            "flush",
            "harvest_check",
        ],
        icon="mdi:content-cut",
        value_fn=lambda d: d.get("next_training_event"),
        attrs_fn=lambda c: {
            "in_days": (c.data or {}).get("next_training_in_days"),
        },
    ),
    PGSensorDescription(
        key="reservoir_liters",
        translation_key="reservoir_liters",
        native_unit_of_measurement="L",
        device_class=SensorDeviceClass.VOLUME_STORAGE,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        icon="mdi:car-coolant-level",
        value_fn=lambda d: d.get("reservoir_liters"),
    ),
    # --- Licht ---
    PGSensorDescription(
        key="light_elapsed_pct",
        translation_key="light_elapsed_pct",
        native_unit_of_measurement="%",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        icon="mdi:white-balance-sunny",
        value_fn=lambda d: d.get("light_elapsed_pct"),
        attrs_fn=lambda c: {
            "light_on": (c.data or {}).get("light_on"),
            "lights_on_time": (c.data or {}).get("lights_on_time"),
            "lights_off_time": (c.data or {}).get("lights_off_time"),
            "light_elapsed_min": (c.data or {}).get("light_elapsed_min"),
            "light_remaining_min": (c.data or {}).get("light_remaining_min"),
        },
    ),
    PGSensorDescription(
        key="light_remaining",
        translation_key="light_remaining",
        native_unit_of_measurement="min",
        device_class=SensorDeviceClass.DURATION,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:timer-outline",
        value_fn=lambda d: d.get("light_remaining_min"),
    ),
    # --- Setup-Test ---
    PGSensorDescription(
        key="test_status",
        translation_key="test_status",
        device_class=SensorDeviceClass.ENUM,
        options=["pass", "warning", "fail", "running"],
        icon="mdi:clipboard-check",
        value_fn=lambda d: d.get("test_status"),
        attrs_fn=lambda c: c.state.get("test_results") or {},
    ),
    # --- A/B-Vergleich ---
    PGSensorDescription(
        key="comparison",
        translation_key="comparison",
        icon="mdi:compare",
        value_fn=lambda d: d.get("comparison_state"),
        attrs_fn=lambda c: c.state.get("comparison") or {},
    ),
    # --- Diary ---
    PGSensorDescription(
        key="diary_count",
        translation_key="diary_count",
        native_unit_of_measurement="entries",
        state_class=SensorStateClass.TOTAL_INCREASING,
        icon="mdi:notebook",
        value_fn=lambda d: d.get("diary_count"),
        attrs_fn=lambda c: {"entries": c.diary_entries(30)},
    ),
    # --- Alerts (aggregated) ---
    PGSensorDescription(
        key="alert_level",
        translation_key="alerts",
        icon="mdi:bell-alert",
        value_fn=lambda d: d.get("alert_level"),
        attrs_fn=lambda c: {
            "count": (c.data or {}).get("alert_count"),
            "items": (c.data or {}).get("alerts"),
            "muted_until": (c.data or {}).get("alerts_muted_until"),
        },
    ),
    # --- Substrate (VWC/EC) ---
    PGSensorDescription(
        key="vwc",
        translation_key="vwc",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:water-opacity",
        value_fn=lambda d: d.get("vwc"),
        attrs_fn=lambda c: {
            "dryback_source": (c.data or {}).get("dryback_source"),
            "peak_today": c.state.get("vwc_peak"),
            "trough_today": c.state.get("vwc_trough"),
        },
    ),
    PGSensorDescription(
        key="pore_ec",
        translation_key="pore_ec",
        native_unit_of_measurement="mS/cm",
        state_class=SensorStateClass.MEASUREMENT,
        icon="mdi:flash-outline",
        value_fn=lambda d: d.get("pore_ec"),
        attrs_fn=lambda c: {
            "bulk_ec": (c.data or {}).get("substrate_ec"),
            "substrate_temp": (c.data or {}).get("substrate_temp"),
        },
    ),
    # --- Irrigation safety ---
    PGSensorDescription(
        key="irrigation_shots_today",
        translation_key="irrigation_today",
        native_unit_of_measurement="shots",
        icon="mdi:water-sync",
        value_fn=lambda d: d.get("irrigation_shots_today"),
        attrs_fn=lambda c: {
            "runtime_today_min": (c.data or {}).get("irrigation_runtime_today_min"),
            "forced_off_today": (c.data or {}).get("irrigation_forced_off_today"),
            "locked": (c.data or {}).get("irrigation_locked"),
            "lock_reasons": (c.data or {}).get("irrigation_lock_reasons"),
        },
    ),
    # --- Energy / costs ---
    PGSensorDescription(
        key="extra_costs_total",
        translation_key="extra_costs_total",
        native_unit_of_measurement="€",
        icon="mdi:cash-multiple",
        value_fn=lambda d: d.get("extra_costs_total"),
        attrs_fn=lambda c: {"entries": (c.state.get("extra_costs") or [])[-20:]},
    ),
    PGSensorDescription(
        key="energy_total_kwh",
        translation_key="energy_total_kwh",
        native_unit_of_measurement=UnitOfEnergy.KILO_WATT_HOUR,
        device_class=SensorDeviceClass.ENERGY,
        state_class=SensorStateClass.TOTAL_INCREASING,
        suggested_display_precision=3,
        value_fn=lambda d: d.get("energy_total_kwh"),
        attrs_fn=lambda c: (c.data or {}).get("energy_by_device") or {},
    ),
    PGSensorDescription(
        key="energy_cost_eur",
        translation_key="energy_cost_eur",
        native_unit_of_measurement="€",
        device_class=SensorDeviceClass.MONETARY,
        state_class=SensorStateClass.TOTAL,
        suggested_display_precision=2,
        icon="mdi:currency-eur",
        value_fn=lambda d: d.get("energy_cost_eur"),
    ),
    PGSensorDescription(
        key="daily_cost_eur",
        translation_key="daily_cost_eur",
        native_unit_of_measurement="€",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:cash-clock",
        value_fn=lambda d: d.get("daily_cost_eur"),
    ),
    PGSensorDescription(
        key="cost_per_gram",
        translation_key="cost_per_gram",
        native_unit_of_measurement="€/g",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        icon="mdi:scale-balance",
        value_fn=lambda d: d.get("cost_per_gram"),
        attrs_fn=lambda c: c.state.get("harvest") or {},
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrecisionGrowConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Sensoren einrichten."""
    coordinator = entry.runtime_data
    async_add_entities(
        PrecisionGrowSensor(coordinator, desc) for desc in SENSORS
    )


class PrecisionGrowSensor(PrecisionGrowEntity, SensorEntity):
    """Generischer berechneter Sensor."""

    entity_description: PGSensorDescription

    def __init__(
        self,
        coordinator: PrecisionGrowCoordinator,
        description: PGSensorDescription,
    ) -> None:
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.entry.entry_id}_{description.key}"

    @property
    def native_value(self) -> Any:
        return self.entity_description.value_fn(self.coordinator.data or {})

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        if self.entity_description.attrs_fn:
            return self.entity_description.attrs_fn(self.coordinator)
        return None
