"""Services for Precision Grow: log_runoff, advance_phase, set_phase, set_harvest."""
from __future__ import annotations

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN, PHASES
from .coordinator import PrecisionGrowCoordinator

SERVICE_LOG_RUNOFF = "log_runoff"
SERVICE_ADVANCE_PHASE = "advance_phase"
SERVICE_SET_PHASE = "set_phase"
SERVICE_SET_HARVEST = "set_harvest"
SERVICE_EXPORT_CSV = "export_csv"
SERVICE_ADD_DIARY = "add_diary_entry"
SERVICE_TEST_SETUP = "test_setup"
SERVICE_TEST_PUMP = "test_pump"
SERVICE_ARCHIVE_GROW = "archive_grow"
SERVICE_CONFIRM_FLOWER = "confirm_flower_switch"
SERVICE_POSTPONE_FLOWER = "postpone_flower_switch"
SERVICE_ADD_EXTRA_COST = "add_extra_cost"
SERVICE_MUTE_ALERTS = "mute_alerts"

ATTR_ENTRY_ID = "entry_id"

_RUNOFF_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Required("runoff_ec"): vol.Coerce(float),
        vol.Required("runoff_ph"): vol.Coerce(float),
        vol.Optional("volume_ml"): vol.Coerce(float),
        vol.Optional("ppm"): vol.Coerce(float),
        vol.Optional("note", default=""): cv.string,
    }
)

_PHASE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Required("phase"): vol.In(PHASES),
    }
)

_ADVANCE_SCHEMA = vol.Schema({vol.Optional(ATTR_ENTRY_ID): cv.string})

_EXPORT_SCHEMA = vol.Schema({vol.Optional(ATTR_ENTRY_ID): cv.string})

_DIARY_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Optional("comment", default=""): cv.string,
        vol.Optional("image", default=""): cv.string,
    }
)

_TEST_SETUP_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Optional("include_pump", default=False): cv.boolean,
        vol.Optional("duration", default=60): vol.All(vol.Coerce(int), vol.Range(min=5, max=300)),
    }
)

_TEST_PUMP_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Optional("duration", default=15): vol.All(vol.Coerce(int), vol.Range(min=1, max=60)),
    }
)

_EXTRA_COST_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Required("amount"): vol.Coerce(float),
        vol.Optional("note", default=""): cv.string,
    }
)

_MUTE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Optional("minutes", default=60): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=1440)
        ),
    }
)

_HARVEST_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTRY_ID): cv.string,
        vol.Required("wet_g"): vol.Coerce(float),
        vol.Required("dry_g"): vol.Coerce(float),
        vol.Optional("extra_cost", default=0.0): vol.Coerce(float),
    }
)


def _coordinators(
    hass: HomeAssistant, entry_id: str | None
) -> list[PrecisionGrowCoordinator]:
    """Resolve the coordinator(s) for the service call."""
    entries = hass.config_entries.async_entries(DOMAIN)
    coords: list[PrecisionGrowCoordinator] = []
    for entry in entries:
        if entry_id and entry.entry_id != entry_id:
            continue
        coord = getattr(entry, "runtime_data", None)
        if coord is not None:
            coords.append(coord)
    if not coords:
        raise ServiceValidationError("No active Precision Grow entry found.")
    return coords


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register services (idempotent)."""
    if hass.services.has_service(DOMAIN, SERVICE_LOG_RUNOFF):
        return

    async def _log_runoff(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_log_runoff(
                runoff_ec=call.data["runoff_ec"],
                runoff_ph=call.data["runoff_ph"],
                volume_ml=call.data.get("volume_ml"),
                ppm=call.data.get("ppm"),
                note=call.data.get("note", ""),
            )

    async def _advance_phase(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            idx = PHASES.index(c.phase) if c.phase in PHASES else 0
            await c.async_set_phase(PHASES[min(idx + 1, len(PHASES) - 1)])

    async def _set_phase(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_set_phase(call.data["phase"])

    async def _add_extra_cost(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_add_extra_cost(
                amount=call.data["amount"],
                note=call.data.get("note", ""),
            )

    async def _mute_alerts(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_mute_alerts(call.data.get("minutes", 60))

    async def _set_harvest(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_set_harvest(
                wet_g=call.data["wet_g"],
                dry_g=call.data["dry_g"],
                extra_cost=call.data.get("extra_cost", 0.0),
            )

    async def _export_csv(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_export_and_notify()

    async def _add_diary(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_save_diary_today(
                comment=call.data.get("comment") or None,
                image=call.data.get("image") or None,
            )

    hass.services.async_register(DOMAIN, SERVICE_LOG_RUNOFF, _log_runoff, _RUNOFF_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_ADD_EXTRA_COST, _add_extra_cost, _EXTRA_COST_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_MUTE_ALERTS, _mute_alerts, _MUTE_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_EXPORT_CSV, _export_csv, _EXPORT_SCHEMA
    )
    async def _test_setup(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_test_setup(
                include_pump=call.data.get("include_pump", False),
                duration=call.data.get("duration", 60),
            )

    async def _test_pump(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_test_pump(duration=call.data.get("duration", 15))

    async def _archive_grow(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_archive_grow()

    async def _confirm_flower(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_confirm_flower_switch()

    async def _postpone_flower(call: ServiceCall) -> None:
        for c in _coordinators(hass, call.data.get(ATTR_ENTRY_ID)):
            await c.async_postpone_flower_switch()

    hass.services.async_register(
        DOMAIN, SERVICE_ADD_DIARY, _add_diary, _DIARY_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_TEST_SETUP, _test_setup, _TEST_SETUP_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_TEST_PUMP, _test_pump, _TEST_PUMP_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_ARCHIVE_GROW, _archive_grow, _EXPORT_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_CONFIRM_FLOWER, _confirm_flower, _EXPORT_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_POSTPONE_FLOWER, _postpone_flower, _EXPORT_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_ADVANCE_PHASE, _advance_phase, _ADVANCE_SCHEMA
    )
    hass.services.async_register(DOMAIN, SERVICE_SET_PHASE, _set_phase, _PHASE_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_SET_HARVEST, _set_harvest, _HARVEST_SCHEMA
    )


_ALL_SERVICES = (
    SERVICE_LOG_RUNOFF,
    SERVICE_ADVANCE_PHASE,
    SERVICE_SET_PHASE,
    SERVICE_SET_HARVEST,
    SERVICE_EXPORT_CSV,
    SERVICE_ADD_DIARY,
    SERVICE_TEST_SETUP,
    SERVICE_TEST_PUMP,
    SERVICE_ARCHIVE_GROW,
    SERVICE_CONFIRM_FLOWER,
    SERVICE_POSTPONE_FLOWER,
    SERVICE_ADD_EXTRA_COST,
    SERVICE_MUTE_ALERTS,
)


def async_unload_services(hass: HomeAssistant) -> None:
    """Remove all domain services (called when the last entry is unloaded)."""
    for service in _ALL_SERVICES:
        if hass.services.has_service(DOMAIN, service):
            hass.services.async_remove(DOMAIN, service)
