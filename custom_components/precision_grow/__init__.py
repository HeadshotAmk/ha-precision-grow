"""Precision Grow — HACS custom integration for indoor growers."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PLATFORMS
from .coordinator import PrecisionGrowCoordinator

_LOGGER = logging.getLogger(__name__)

PrecisionGrowConfigEntry = ConfigEntry[PrecisionGrowCoordinator]


async def async_setup_entry(
    hass: HomeAssistant, entry: PrecisionGrowConfigEntry
) -> bool:
    """Set up the integration from a config entry."""
    coordinator = PrecisionGrowCoordinator(hass, entry)
    await coordinator.async_load_state()
    await coordinator.async_ensure_dirs()
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator
    await coordinator.async_collect_compare_sources()

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    # Register services (idempotent)
    from .services import async_setup_services

    await async_setup_services(hass)
    return True


async def async_unload_entry(
    hass: HomeAssistant, entry: PrecisionGrowConfigEntry
) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    # Remove services once the last grow is unloaded.
    if unload_ok and len(hass.config_entries.async_entries(DOMAIN)) <= 1:
        from .services import async_unload_services

        async_unload_services(hass)
    return unload_ok


async def _async_update_listener(
    hass: HomeAssistant, entry: PrecisionGrowConfigEntry
) -> None:
    """Reload on options change."""
    await hass.config_entries.async_reload(entry.entry_id)
