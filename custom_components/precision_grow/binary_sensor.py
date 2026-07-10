"""Binary sensors for Precision Grow."""
from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import PrecisionGrowConfigEntry
from .coordinator import PrecisionGrowCoordinator
from .entity import PrecisionGrowEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrecisionGrowConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    async_add_entities(
        [
            FlowerSwitchDueBinarySensor(entry.runtime_data),
            PhaseSwitchDueBinarySensor(entry.runtime_data),
            IrrigationLockedBinarySensor(entry.runtime_data),
        ]
    )


class IrrigationLockedBinarySensor(PrecisionGrowEntity, BinarySensorEntity):
    """On when the safety layer blocks new pump starts."""

    _attr_translation_key = "irrigation_locked"
    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _attr_icon = "mdi:water-off"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_irrigation_locked"

    @property
    def is_on(self) -> bool:
        return bool((self.coordinator.data or {}).get("irrigation_locked"))

    @property
    def extra_state_attributes(self) -> dict:
        data = self.coordinator.data or {}
        return {
            "reasons": data.get("irrigation_lock_reasons"),
            "shots_today": data.get("irrigation_shots_today"),
            "runtime_today_min": data.get("irrigation_runtime_today_min"),
            "forced_off_today": data.get("irrigation_forced_off_today"),
        }


class PhaseSwitchDueBinarySensor(PrecisionGrowEntity, BinarySensorEntity):
    """On when the current phase reached its target length (Athena schedule)."""

    _attr_translation_key = "phase_switch_due"
    _attr_icon = "mdi:swap-horizontal-circle"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_phase_switch_due"

    @property
    def is_on(self) -> bool:
        return bool((self.coordinator.data or {}).get("phase_switch_due"))

    @property
    def extra_state_attributes(self) -> dict:
        data = self.coordinator.data or {}
        return {
            "switch_to": data.get("phase_switch_to"),
            "reason": data.get("phase_switch_reason"),
            "day_in_phase": data.get("day_in_phase"),
        }


class FlowerSwitchDueBinarySensor(PrecisionGrowEntity, BinarySensorEntity):
    """On when a regular plant has reached veg time and awaits the 12/12 confirm."""

    _attr_translation_key = "flower_switch_due"
    _attr_icon = "mdi:flower-tulip"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_flower_switch_due"

    @property
    def is_on(self) -> bool:
        return bool((self.coordinator.data or {}).get("flower_switch_due"))

    @property
    def extra_state_attributes(self) -> dict:
        data = self.coordinator.data or {}
        return {
            "veg_days_effective": data.get("veg_days_effective"),
            "day_total": data.get("day_total"),
        }
