"""Time entities for Precision Grow (lights-on time)."""
from __future__ import annotations

from datetime import time as dt_time

from homeassistant.components.time import TimeEntity
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
    async_add_entities([LightsOnTime(entry.runtime_data)])


class LightsOnTime(PrecisionGrowEntity, TimeEntity):
    """Editable lights-on time; drives the light progress and P-phase logic."""

    _attr_translation_key = "lights_on"
    _attr_icon = "mdi:weather-sunset-up"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_lights_on"

    @property
    def native_value(self) -> dt_time | None:
        raw = self.coordinator.lights_on()
        try:
            parts = [int(x) for x in str(raw).split(":")]
            while len(parts) < 3:
                parts.append(0)
            return dt_time(parts[0], parts[1], parts[2])
        except (ValueError, TypeError):
            return None

    async def async_set_value(self, value: dt_time) -> None:
        await self.coordinator.async_set_lights_on(value.strftime("%H:%M:%S"))
