"""Select entities for Precision Grow (phase)."""
from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import PrecisionGrowConfigEntry
from .const import PHASES
from .coordinator import PrecisionGrowCoordinator
from .entity import PrecisionGrowEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrecisionGrowConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities(
        [
            PhaseSelect(coordinator),
            CompareSelect(coordinator, "a"),
            CompareSelect(coordinator, "b"),
        ]
    )


class PhaseSelect(PrecisionGrowEntity, SelectEntity):
    """Aktuelle Wachstums-Phase manuell setzen."""

    _attr_translation_key = "phase"
    _attr_options = PHASES
    _attr_icon = "mdi:sprout"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_phase_select"

    @property
    def current_option(self) -> str:
        return self.coordinator.phase

    async def async_select_option(self, option: str) -> None:
        await self.coordinator.async_set_phase(option)


class CompareSelect(PrecisionGrowEntity, SelectEntity):
    """Select grow A or B for the A/B comparison."""

    _attr_icon = "mdi:compare"

    def __init__(self, coordinator: PrecisionGrowCoordinator, slot: str) -> None:
        super().__init__(coordinator)
        self._slot = slot
        self._attr_translation_key = f"compare_{slot}"
        self._attr_unique_id = f"{coordinator.entry.entry_id}_compare_{slot}"

    @property
    def options(self) -> list[str]:
        labels = self.coordinator.state.get("compare_labels") or []
        return labels or ["—"]

    @property
    def current_option(self) -> str | None:
        return self.coordinator.state.get(f"compare_{self._slot}")

    async def async_select_option(self, option: str) -> None:
        await self.coordinator.async_set_compare(self._slot, option)
