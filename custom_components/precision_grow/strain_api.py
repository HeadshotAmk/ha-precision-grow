"""Strain-Datenquelle.

Timing (veg/flower time) comes manually / from the community JSON — there is NO
free API for it (breeder-/seed-specific). Cannlytics is only used for
metadata enrichment (THC/CBD/terpenes/effects). No API key needed.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any
from urllib.parse import quote_plus

import aiohttp

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import STRAIN_TIMING_DEFAULTS

_LOGGER = logging.getLogger(__name__)

CANNLYTICS_BASE = "https://cannlytics.com/api/data/strains"
REQUEST_TIMEOUT = 10

_COMMUNITY_FILE = os.path.join(os.path.dirname(__file__), "data", "strains_community.json")

# Known terpenes in the Cannlytics response (for top-terpene selection)
_TERPENES = [
    "beta_myrcene",
    "d_limonene",
    "beta_caryophyllene",
    "alpha_pinene",
    "beta_pinene",
    "linalool",
    "humulene",
    "terpinolene",
    "ocimene",
    "alpha_bisabolol",
    "nerolidol",
    "guaiol",
]


def timing_defaults(strain_type: str | None, is_auto: bool = False) -> dict[str, int]:
    """Veg/flower defaults by strain type (auto overrides genetics)."""
    if is_auto:
        return dict(STRAIN_TIMING_DEFAULTS["auto"])
    return dict(STRAIN_TIMING_DEFAULTS.get((strain_type or "hybrid").lower(),
                                           STRAIN_TIMING_DEFAULTS["hybrid"]))


def _guess_type(text: str) -> str:
    """Guess genetics (indica/sativa/hybrid) from free text."""
    t = (text or "").lower()
    has_ind = "indica" in t
    has_sat = "sativa" in t
    if has_ind and not has_sat:
        return "indica"
    if has_sat and not has_ind:
        return "sativa"
    return "hybrid"


def _guess_auto(text: str) -> bool:
    """Detect autoflower hints in free text."""
    t = (text or "").lower()
    return "auto" in t or "ruderalis" in t


def _normalize_cannlytics(raw: dict[str, Any]) -> dict[str, Any]:
    """Map a Cannlytics record to our schema."""
    terps = sorted(
        ((k, raw.get(k, 0) or 0) for k in _TERPENES),
        key=lambda kv: kv[1],
        reverse=True,
    )
    top_terpenes = [k.replace("_", " ") for k, v in terps if v > 0][:4]

    thc = raw.get("total_thc") or raw.get("delta_9_thc") or 0
    cbd = raw.get("total_cbd") or raw.get("cbd") or 0
    effects = [
        e.replace("effect_", "") for e in (raw.get("potential_effects") or [])
    ]
    text = f"{raw.get('strain_name', '')} {raw.get('description', '')}"
    stype = _guess_type(text)

    return {
        "name": raw.get("strain_name") or raw.get("id"),
        "strain_type": stype,
        "plant_type": "auto" if _guess_auto(text) else "regular",
        "thc": round(float(thc), 1) if thc else None,
        "cbd": round(float(cbd), 2) if cbd else None,
        "terpenes": top_terpenes,
        "effects": effects[:5],
        "description": raw.get("description"),
        "source": "cannlytics",
    }


async def async_lookup_cannlytics(
    hass: HomeAssistant, name: str
) -> dict[str, Any] | None:
    """Fetch metadata for a strain from Cannlytics (no key needed)."""
    if not name:
        return None
    session = async_get_clientsession(hass)
    url = f"{CANNLYTICS_BASE}/{quote_plus(name)}"
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)) as resp:
            if resp.status != 200:
                return None
            payload = await resp.json(content_type=None)
    except (aiohttp.ClientError, TimeoutError, ValueError) as err:
        _LOGGER.debug("Cannlytics lookup failed for %s: %s", name, err)
        return None

    data = payload.get("data") if isinstance(payload, dict) else None
    if isinstance(data, list):
        data = data[0] if data else None
    if not isinstance(data, dict) or not data:
        return None
    return _normalize_cannlytics(data)


def _load_community_file() -> dict[str, Any]:
    """Load the community JSON synchronously (call in an executor)."""
    try:
        with open(_COMMUNITY_FILE, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError) as err:
        _LOGGER.debug("Community strain file not readable: %s", err)
        return {}


async def async_lookup_community(
    hass: HomeAssistant, name: str
) -> dict[str, Any] | None:
    """Strain from the local community JSON (also contains veg/flower time)."""
    if not name:
        return None
    data = await hass.async_add_executor_job(_load_community_file)
    strains = data.get("strains", {}) if isinstance(data, dict) else {}
    key = name.strip().lower()
    for slug, entry in strains.items():
        if slug.lower() == key or (entry.get("name", "").lower() == key):
            result = dict(entry)
            result.setdefault("name", slug)
            result["source"] = "community"
            return result
    return None


async def async_lookup_strain(
    hass: HomeAssistant, name: str
) -> dict[str, Any]:
    """Combined lookup: community JSON (incl. timing) + Cannlytics metadata.

    Always returns a dict with defaults; 'found' indicates whether anything was found.
    """
    community = await async_lookup_community(hass, name)
    cannlytics = await async_lookup_cannlytics(hass, name)

    found = bool(community or cannlytics)
    base: dict[str, Any] = {"name": name, "found": found}

    # Metadata: Cannlytics first, community overrides (curated)
    if cannlytics:
        base.update({k: v for k, v in cannlytics.items() if v is not None})
    if community:
        base.update({k: v for k, v in community.items() if v is not None})

    stype = base.get("strain_type", "hybrid")
    ptype = base.get("plant_type", "regular")
    defaults = timing_defaults(stype, is_auto=ptype == "auto")
    base.setdefault("veg_days", defaults["veg_days"])
    base.setdefault("flower_days", defaults["flower_days"])
    base.setdefault("strain_type", stype)
    base.setdefault("plant_type", ptype)
    return base
