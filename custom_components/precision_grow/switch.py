"""Switch entities for Precision Grow (irrigation kill switch)."""
from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
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
    async_add_entities([IrrigationEnabledSwitch(entry.runtime_data)])


class IrrigationEnabledSwitch(PrecisionGrowEntity, SwitchEntity):
    """Kill switch: OFF blocks all pump starts (fail-safe irrigation layer)."""

    _attr_translation_key = "irrigation_enabled"
    _attr_icon = "mdi:water-check"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_irrigation_enabled"

    @property
    def is_on(self) -> bool:
        return bool(self.coordinator.state.get("irrigation_enabled", True))

    async def async_turn_on(self, **kwargs) -> None:
        await self.coordinator.async_set_irrigation_enabled(True)

    async def async_turn_off(self, **kwargs) -> None:
        await self.coordinator.async_set_irrigation_enabled(False)
