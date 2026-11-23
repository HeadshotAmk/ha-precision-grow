"""Sidebar panel and websocket API for Precision Grow.

The panel is a single bundled web component (frontend/precision-grow-panel.js,
built from /frontend). It reads live states from the hass object and gets the
grow list with its entity mapping from the `precision_grow/grows` command.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN

PANEL_URL_PATH = "precision-grow"
PANEL_ELEMENT = "precision-grow-panel"
STATIC_URL = f"/{DOMAIN}_static"
PANEL_FILE = "precision-grow-panel.js"
_FRONTEND_DIR = Path(__file__).parent / "frontend"
_DATA_PANEL = f"{DOMAIN}_panel_registered"
_DATA_STATIC = f"{DOMAIN}_static_registered"


def _version() -> str:
    """Cache-busting token: mtime of the bundle (changes on every update)."""
    try:
        return str(int((_FRONTEND_DIR / PANEL_FILE).stat().st_mtime))
    except OSError:
        return "0"


async def async_setup_panel(hass: HomeAssistant) -> None:
    """Register static path, websocket command and sidebar panel (once)."""
    if not hass.data.get(_DATA_STATIC):
        # aiohttp routes cannot be removed: register only once per HA run.
        hass.data[_DATA_STATIC] = True
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(_FRONTEND_DIR), False)]
        )
        websocket_api.async_register_command(hass, ws_grows)

    if hass.data.get(_DATA_PANEL):
        return
    hass.data[_DATA_PANEL] = True

    version = await hass.async_add_executor_job(_version)
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_ELEMENT,
        sidebar_title="Precision Grow",
        sidebar_icon="mdi:sprout",
        module_url=f"{STATIC_URL}/{PANEL_FILE}?v={version}",
        embed_iframe=False,
        require_admin=False,
    )


@callback
def async_remove_panel(hass: HomeAssistant) -> None:
    """Remove the sidebar panel (static path and command stay registered)."""
    if hass.data.pop(_DATA_PANEL, None):
        frontend.async_remove_panel(hass, PANEL_URL_PATH)


def _as_list(value: Any) -> Any:
    """Tuples are not JSON-friendly in every client; send lists."""
    if isinstance(value, tuple):
        return list(value)
    return value


def _grow_payload(hass: HomeAssistant, entry: Any) -> dict[str, Any]:
    coordinator = entry.runtime_data
    registry = er.async_get(hass)
    prefix = f"{entry.entry_id}_"
    entities: dict[str, str] = {}
    for reg in er.async_entries_for_config_entry(registry, entry.entry_id):
        if reg.unique_id.startswith(prefix):
            entities[reg.unique_id[len(prefix):]] = reg.entity_id

    data = coordinator.data or {}
    phase = coordinator.phase
    targets = {k: _as_list(v) for k, v in coordinator.phase_targets(phase).items()}
    return {
        "entry_id": entry.entry_id,
        "title": entry.title,
        "phase": phase,
        "targets": targets,
        "dli_target": [data.get("dli_target_min"), data.get("dli_target_max")],
        "brightness_target": data.get("brightness_target"),
        "entities": entities,
    }


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/grows"})
@callback
def ws_grows(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Return all loaded grows with phase targets and entity mapping."""
    grows = [
        _grow_payload(hass, entry)
        for entry in hass.config_entries.async_entries(DOMAIN)
        if entry.state is ConfigEntryState.LOADED
        and getattr(entry, "runtime_data", None) is not None
    ]
    connection.send_result(msg["id"], {"grows": grows})
