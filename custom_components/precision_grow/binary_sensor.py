"""Binary sensors for Precision Grow."""
from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorEntity
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
    async_add_entities([FlowerSwitchDueBinarySensor(entry.runtime_data)])


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
