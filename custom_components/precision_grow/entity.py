"""Base entity for Precision Grow."""
from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, MANUFACTURER
from .coordinator import PrecisionGrowCoordinator


class PrecisionGrowEntity(CoordinatorEntity[PrecisionGrowCoordinator]):
    """Common base — groups all entities under one device."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        entry = coordinator.entry
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            manufacturer=MANUFACTURER,
            model="Precision Grow Controller",
        )
