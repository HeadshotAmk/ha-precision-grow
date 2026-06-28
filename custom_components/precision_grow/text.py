"""Text entities for Precision Grow (diary inputs)."""
from __future__ import annotations

from homeassistant.components.text import TextEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import PrecisionGrowConfigEntry
from .const import TEXT_DIARY_COMMENT, TEXT_DIARY_IMAGE
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
            DiaryText(coordinator, TEXT_DIARY_COMMENT, "diary_comment", "mdi:comment-text"),
            DiaryText(coordinator, TEXT_DIARY_IMAGE, "diary_image", "mdi:image"),
        ]
    )


class DiaryText(PrecisionGrowEntity, TextEntity):
    """Input field whose value is persisted in the coordinator state."""

    _attr_mode = "text"
    _attr_native_max = 500

    def __init__(
        self,
        coordinator: PrecisionGrowCoordinator,
        key: str,
        translation_key: str,
        icon: str,
    ) -> None:
        super().__init__(coordinator)
        self._key = key
        self._attr_translation_key = translation_key
        self._attr_icon = icon
        self._attr_unique_id = f"{coordinator.entry.entry_id}_{key}"

    @property
    def native_value(self) -> str:
        return self.coordinator.state.get("text_inputs", {}).get(self._key, "")

    async def async_set_value(self, value: str) -> None:
        await self.coordinator.async_set_text(self._key, value)
