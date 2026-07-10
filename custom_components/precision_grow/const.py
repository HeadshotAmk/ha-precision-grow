"""Constants, targets and calculation formulas for Precision Grow.

Central place for ALL sensor calculations, phase targets, substrate data,
shot volumes and nutrient presets.
"""
from __future__ import annotations

import math
from typing import Final

DOMAIN: Final = "precision_grow"
PLATFORMS: Final = [
    "sensor", "binary_sensor", "select", "number", "button", "text", "time",
    "switch",
]

# Diary input fields (text)
TEXT_DIARY_COMMENT: Final = "diary_comment"
TEXT_DIARY_IMAGE: Final = "diary_image"

DEFAULT_NAME: Final = "Grow"
MANUFACTURER: Final = "Precision Grow"

# --------------------------------------------------------------------------- #
# Config entry keys
# --------------------------------------------------------------------------- #
# Step 1 — basics
CONF_GROW_NAME: Final = "grow_name"
CONF_START_DATE: Final = "start_date"
CONF_PLANT_COUNT: Final = "plant_count"
CONF_STRAIN: Final = "strain"
CONF_SUBSTRATE: Final = "substrate"
CONF_CONTAINER_TYPE: Final = "container_type"
CONF_CONTAINER_SIZE_ML: Final = "container_size_ml"
CONF_POWER_PRICE: Final = "power_price"

# Step 2 — nutrients
CONF_NUTRIENT_PRESET: Final = "nutrient_preset"

# Step 3 — sensor mapping
CONF_SENSOR_TEMP: Final = "sensor_temp"
CONF_SENSOR_HUMIDITY: Final = "sensor_humidity"
CONF_SENSOR_WEIGHT: Final = "sensor_weight"
CONF_SENSOR_RESERVOIR: Final = "sensor_reservoir"
CONF_SENSOR_CO2: Final = "sensor_co2"
CONF_SENSOR_PPFD: Final = "sensor_ppfd"
CONF_SENSOR_EC: Final = "sensor_ec"
CONF_SENSOR_PH: Final = "sensor_ph"
CONF_SENSOR_WATER_TEMP: Final = "sensor_water_temp"
CONF_SENSOR_BRIGHTNESS: Final = "sensor_brightness"  # light brightness (e.g. Mars Hydro)
CONF_SENSOR_VWC: Final = "sensor_vwc"                    # substrate VWC % (TDR/capacitive)
CONF_SENSOR_SUBSTRATE_EC: Final = "sensor_substrate_ec"  # substrate bulk EC (mS/cm)
CONF_SENSOR_SUBSTRATE_TEMP: Final = "sensor_substrate_temp"  # substrate temperature (°C)

# Step 4 — device mapping
CONF_DEVICE_HEATER: Final = "device_heater"
CONF_DEVICE_COOLER: Final = "device_cooler"
CONF_DEVICE_HUMIDIFIER: Final = "device_humidifier"
CONF_DEVICE_DEHUMIDIFIER: Final = "device_dehumidifier"
CONF_DEVICE_PUMP: Final = "device_pump"
CONF_DEVICE_LIGHT: Final = "device_light"
CONF_DEVICE_EXHAUST: Final = "device_exhaust"
CONF_DEVICE_CO2_VALVE: Final = "device_co2_valve"

# Step 5 — power
CONF_POWER_ENTITIES: Final = "power_entities"

# Step 6 — storage
CONF_PHOTO_TARGET: Final = "photo_target"
CONF_DIARY_ENABLED: Final = "diary_enabled"
CONF_NOTIFY_TARGET: Final = "notify_target"  # notify entity or <domain>.<service> for push alerts
CONF_MEDIA_PATH: Final = "media_path"   # base path (e.g. Synology mount /media/synology)

DEFAULT_MEDIA_PATH: Final = "/media"

# Options / runtime
CONF_PHOTOPERIOD: Final = "photoperiod_hours"
CONF_LEAF_OFFSET: Final = "leaf_offset"
CONF_LIGHTS_ON: Final = "lights_on"
CONF_TANK_VOLUME_L: Final = "tank_volume_l"

# Strain / grow start
CONF_PROPAGATION: Final = "propagation"        # seed | clone
CONF_PLANT_AGE_DAYS: Final = "plant_age_days"  # age at setup
CONF_STRAIN_TYPE: Final = "strain_type"
CONF_STRAIN_SLUG: Final = "strain_slug"
CONF_VEG_DAYS: Final = "veg_days"
CONF_FLOWER_DAYS: Final = "flower_days"
CONF_THC: Final = "thc"
CONF_CBD: Final = "cbd"
CONF_STRAIN_CUSTOM: Final = "strain_custom"    # skip lookup

PROPAGATION_TYPES: Final = ["seed", "clone"]
STRAIN_TYPES: Final = ["indica", "sativa", "hybrid"]
PLANT_TYPES: Final = ["regular", "auto"]  # regular = photoperiod, auto = autoflower

CONF_PLANT_TYPE: Final = "plant_type"
CONF_FLOWER_PHOTOPERIOD: Final = "flower_photoperiod"
DEFAULT_FLOWER_PHOTOPERIOD: Final = 12.0

# Flower switch (regular plants): manual confirm with postpone
NUM_FLOWER_POSTPONE: Final = "flower_postpone_days"

# Irrigation safety layer (fail-safe guards for the mapped pump)
NUM_MAX_SHOT_SECONDS: Final = "max_shot_seconds"        # hard runtime cap per shot (s), 0 = off
NUM_MAX_SHOTS_PER_DAY: Final = "max_shots_per_day"      # 0 = unlimited
NUM_MAX_DAILY_RUNTIME: Final = "max_daily_runtime_min"  # pump runtime per day (min), 0 = unlimited
NUM_MAX_SATURATION: Final = "max_saturation_pct"        # anti-drown: weight vs field capacity (%), 0 = off
DEFAULT_MAX_SHOT_SECONDS: Final = 60
DEFAULT_MAX_SHOTS_PER_DAY: Final = 24
DEFAULT_MAX_DAILY_RUNTIME: Final = 30
DEFAULT_MAX_SATURATION: Final = 98
DEFAULT_FLOWER_POSTPONE: Final = 7

# PPFD model (number settings)
NUM_PPFD_AT_FULL: Final = "ppfd_at_full"        # PPFD at 100% brightness (reference)
NUM_LIGHT_DISTANCE: Final = "light_distance"    # current light->canopy distance (cm)
NUM_PPFD_REF_DISTANCE: Final = "ppfd_ref_distance"  # distance at calibration (cm)
NUM_PPFD_MANUAL: Final = "ppfd_manual"          # manual PPFD value (fallback)

# Dashboard input fields (staging — passed to services via submit button)
INPUT_RUNOFF_EC: Final = "runoff_ec_input"
INPUT_RUNOFF_PH: Final = "runoff_ph_input"
INPUT_RUNOFF_VOLUME: Final = "runoff_volume_input"
INPUT_RUNOFF_PPM: Final = "runoff_ppm_input"
INPUT_HARVEST_WET: Final = "harvest_wet_input"
INPUT_HARVEST_DRY: Final = "harvest_dry_input"
INPUT_HARVEST_EXTRA: Final = "harvest_extra_input"

# --------------------------------------------------------------------------- #
# Selection lists
# --------------------------------------------------------------------------- #
SUBSTRATES: Final = [
    "coco",
    "rockwool",
    "soil",
    "hydro_dwc",
    "hydro_rdwc",
    "hydro_nft",
    "aeroponics",
    "custom",
]

CONTAINER_TYPES: Final = ["pot", "rockwool"]

NUTRIENT_PRESETS: Final = ["lucas_hydro", "lucas_coco", "ironhead_gh_coco", "custom"]

PHOTO_TARGETS: Final = ["ha_media", "synology", "webdav"]

# --------------------------------------------------------------------------- #
# Growth phases
# --------------------------------------------------------------------------- #
PHASE_CLONE: Final = "clone"
PHASE_VEG: Final = "veg"
PHASE_STRETCH: Final = "stretch"
PHASE_BULK: Final = "bulk"
PHASE_RIPEN: Final = "ripen"
PHASE_DRYING: Final = "drying"

PHASES: Final = [
    PHASE_CLONE,
    PHASE_VEG,
    PHASE_STRETCH,
    PHASE_BULK,
    PHASE_RIPEN,
    PHASE_DRYING,
]

# Irrigation phases (daily cycle)
P_PHASES: Final = ["P0", "P1", "P2", "P3"]

# Default phase durations (days) for the phase-switch reminder (Athena-style
# schedule). veg is handled separately via veg_days + flower-switch confirm.
# Override per grow via options["phase_days"][phase].
PHASE_DEFAULT_DAYS: Final = {
    PHASE_CLONE: 14,
    PHASE_STRETCH: 21,
    PHASE_DRYING: 14,
}
RIPEN_LEAD_DAYS: Final = 14  # ripen = last N days of flowering

# Recommended brightness per phase (%) — defaults for the auto-dim blueprint
PHASE_BRIGHTNESS: Final = {
    PHASE_CLONE: 40,
    PHASE_VEG: 70,
    PHASE_STRETCH: 85,
    PHASE_BULK: 100,
    PHASE_RIPEN: 80,
    PHASE_DRYING: 0,
}

# --------------------------------------------------------------------------- #
# Phase targets (Athena-based, editable via options flow)
#   temp_day/night (°C), rh (%), vpd (kPa), ppfd (µmol/m²/s), dryback_p3 (%)
# --------------------------------------------------------------------------- #
PHASE_TARGETS: Final = {
    PHASE_CLONE: {
        "temp_day": (23.0, 26.0),
        "temp_night_offset": 0.0,
        "rh": (65.0, 75.0),
        "vpd": (0.6, 0.9),
        "ppfd": (100, 150),
        "dryback_p3": (30.0, 35.0),
    },
    PHASE_VEG: {
        "temp_day": (22.2, 27.7),
        "temp_night_offset": -2.0,
        "rh": (58.0, 75.0),
        "vpd": (0.8, 1.0),
        "ppfd": (300, 600),
        "dryback_p3": (25.0, 40.0),
    },
    PHASE_STRETCH: {
        "temp_day": (25.5, 27.7),
        "temp_night_offset": -2.0,
        "rh": (60.0, 72.0),
        "vpd": (1.0, 1.2),
        "ppfd": (600, 1000),
        "dryback_p3": (40.0, 50.0),
    },
    PHASE_BULK: {
        "temp_day": (23.8, 26.6),
        "temp_night_offset": -2.0,
        "rh": (60.0, 70.0),
        "vpd": (1.0, 1.2),
        "ppfd": (850, 1200),
        "dryback_p3": (30.0, 40.0),
    },
    PHASE_RIPEN: {
        "temp_day": (18.3, 22.2),
        "temp_night_offset": -2.0,
        "rh": (50.0, 60.0),
        "vpd": (1.2, 1.4),
        "ppfd": (600, 900),
        "dryback_p3": (40.0, 50.0),
    },
    PHASE_DRYING: {
        "temp_day": (15.0, 18.0),
        "temp_night_offset": 0.0,
        "rh": (55.0, 60.0),
        "vpd": (1.2, 1.2),
        "ppfd": (0, 0),
        "dryback_p3": (0.0, 0.0),
    },
}

# Drying phase detail plan (from Athena guide): day -> (temp, rh, vpd)
DRYING_SCHEDULE: Final = {
    1: (22.2, 55.0, 1.2),
    2: (22.2, 55.0, 1.2),
    3: (23.3, 52.0, 1.39),
    4: (23.9, 50.0, 1.5),
    5: (23.9, 50.0, 1.5),
}

# Status strings
STATUS_OPTIMAL: Final = "optimal"
STATUS_HIGH: Final = "high"
STATUS_LOW: Final = "low"

# --------------------------------------------------------------------------- #
# Shot volumes (mL per 1 % of pot volume, from the Athena guide)
# --------------------------------------------------------------------------- #
SHOT_VOLUME_ML_PER_1PCT: Final = {
    "1L_pot": 10,
    "2L_pot": 20,
    "3L_pot": 30,
    "4L_pot": 40,
    "5L_pot": 50,
    "7L_pot": 70,
    "10L_pot": 100,
    "20L_pot": 200,
    "sw_delta65": 6.5,
    "sw_delta10": 10,
    "sw_hugo": 35,
    "sw_unislab": 50,
    "sw_15cm_mat": 100,
}

# Pot sizes in mL (for generic shot-volume calc: 1% = volume/100)
POT_SIZES_ML: Final = {
    "1L_pot": 1000,
    "2L_pot": 2000,
    "3L_pot": 3000,
    "4L_pot": 4000,
    "5L_pot": 5000,
    "7L_pot": 7000,
    "10L_pot": 10000,
    "20L_pot": 20000,
}

ROCKWOOL_TYPES: Final = [
    "sw_delta65",
    "sw_delta10",
    "sw_hugo",
    "sw_unislab",
    "sw_15cm_mat",
]

RUNOFF_TARGET_VEG_PCT: Final = (8, 16)   # 8-16 % of the pot volume
RUNOFF_TARGET_GEN_PCT: Final = (1, 7)    # 1-7 % of the pot volume

# --------------------------------------------------------------------------- #
# Nutrient presets — EC targets per week, pH per phase
#   ec_by_week: {week: EC mS/cm}
#   ph_by_phase: {Phase: pH}
# --------------------------------------------------------------------------- #
NUTRIENT_PROFILES: Final = {
    "lucas_coco": {
        "ph_by_phase": {
            PHASE_CLONE: 5.8,
            PHASE_VEG: 5.8,
            PHASE_STRETCH: 6.0,
            PHASE_BULK: 6.0,
            PHASE_RIPEN: 6.2,
        },
        "ec_by_week": {
            1: 0.8, 2: 1.2, 3: 1.6, 4: 2.0, 5: 2.2,
            6: 2.4, 7: 2.4, 8: 2.0, 9: 1.0,
        },
    },
    "lucas_hydro": {
        "ph_by_phase": {
            PHASE_CLONE: 5.6,
            PHASE_VEG: 5.6,
            PHASE_STRETCH: 5.8,
            PHASE_BULK: 5.8,
            PHASE_RIPEN: 6.0,
        },
        "ec_by_week": {
            1: 0.8, 2: 1.0, 3: 1.4, 4: 1.8, 5: 2.0,
            6: 2.2, 7: 2.2, 8: 1.8, 9: 0.8,
        },
    },
    "ironhead_gh_coco": {
        "ph_by_phase": {
            PHASE_CLONE: 5.8,
            PHASE_VEG: 5.8,
            PHASE_STRETCH: 6.0,
            PHASE_BULK: 6.0,
            PHASE_RIPEN: 6.2,
        },
        "ec_by_week": {
            1: 1.0, 2: 1.4, 3: 1.8, 4: 2.2, 5: 2.6,
            6: 2.8, 7: 2.8, 8: 2.4, 9: 1.2,
        },
    },
    "custom": {
        "ph_by_phase": {p: 6.0 for p in PHASES if p != PHASE_DRYING},
        "ec_by_week": {w: 2.0 for w in range(1, 13)},
    },
}

# --------------------------------------------------------------------------- #
# Default-Werte
# --------------------------------------------------------------------------- #
DEFAULT_POWER_PRICE: Final = 0.35      # €/kWh
DEFAULT_PHOTOPERIOD: Final = 18.0      # h (Veg)
DEFAULT_LEAF_OFFSET: Final = 2.0       # °C
DEFAULT_PLANT_COUNT: Final = 1
DEFAULT_LIGHTS_ON: Final = "06:00:00"  # Lichtbeginn (HH:MM:SS)
DEFAULT_TANK_VOLUME_L: Final = 40.0    # Reservoir-Volumen (L)
DEFAULT_PLANT_AGE_DAYS: Final = 0

# Timing-Defaults (Tage) — manuell überschreibbar, je Strain-Typ
STRAIN_TIMING_DEFAULTS: Final = {
    "indica": {"veg_days": 28, "flower_days": 56},
    "sativa": {"veg_days": 28, "flower_days": 70},
    "hybrid": {"veg_days": 28, "flower_days": 63},
    "auto": {"veg_days": 21, "flower_days": 49},
}
DEFAULT_VEG_DAYS: Final = 28
DEFAULT_FLOWER_DAYS: Final = 63

# P-Phasen Zeitfenster (Stunden relativ zu Lichtbeginn / -ende)
P1_DURATION_H: Final = 2.0   # Aufbau-Rampe nach Lichtbeginn
P3_LEAD_H: Final = 3.0       # Dryback-Fenster vor Lichtende

# Training-Events: (key, flower_day_von, flower_day_bis)
TRAINING_EVENTS: Final = [
    ("lollipopping", 7, 10),
    ("defoliation_1", 21, 28),
    ("defoliation_2", 42, 49),
]

# Reservoir-Schwellen
RESERVOIR_LOW_PCT: Final = 25.0
RESERVOIR_CRITICAL_PCT: Final = 10.0

# Flush/nutrient logic thresholds (EC mS/cm)
EC_FLUSH_DELTA: Final = 2.0
EC_REDUCE_DELTA: Final = 1.0


# --------------------------------------------------------------------------- #
# BERECHNUNGSFORMELN
# --------------------------------------------------------------------------- #
def calculate_svp(temp_c: float) -> float:
    """Sättigungsdampfdruck (kPa) nach Tetens."""
    return 0.6108 * math.exp((17.27 * temp_c) / (temp_c + 237.3))


def calculate_vpd(temp_c: float, rh: float) -> float:
    """Room VPD (kPa)."""
    rh = min(100.0, max(0.0, rh))
    return calculate_svp(temp_c) * (1.0 - rh / 100.0)


def calculate_lvpd(temp_c: float, rh: float, leaf_offset: float = DEFAULT_LEAF_OFFSET) -> float:
    """Leaf VPD (kPa), leaf temperature = air temperature - offset."""
    t_leaf = temp_c - leaf_offset
    svp_leaf = calculate_svp(t_leaf)
    svp_air = calculate_svp(temp_c)
    return svp_leaf - (svp_air * rh / 100.0)


def calculate_dryback(current_weight: float, peak_weight: float, trough_weight: float) -> float:
    """Dryback in % relative to the daily span (peak - trough)."""
    span = peak_weight - trough_weight
    if span <= 0:
        return 0.0
    return max(0.0, ((peak_weight - current_weight) / span) * 100.0)


def _permittivity_from_vwc(vwc_pct: float) -> float:
    """Bulk dielectric permittivity from VWC via the inverse Topp equation.

    Topp (1980): theta = -5.3e-2 + 2.92e-2*eb - 5.5e-4*eb^2 + 4.3e-6*eb^3.
    Solved numerically (Newton). Approximation — fine for soilless media
    when the sensor does not report raw permittivity.
    """
    theta = vwc_pct / 100.0
    eb = 1.0 + theta * 70.0  # start value
    for _ in range(25):
        f = -5.3e-2 + 2.92e-2 * eb - 5.5e-4 * eb**2 + 4.3e-6 * eb**3 - theta
        df = 2.92e-2 - 1.1e-3 * eb + 1.29e-5 * eb**2
        if df == 0:
            break
        step = f / df
        eb -= step
        if abs(step) < 1e-6:
            break
    return max(1.0, eb)


def calculate_pore_ec(
    bulk_ec: float,
    vwc_pct: float,
    temp_c: float = 25.0,
    eps_offset: float = 4.1,
) -> float | None:
    """Pore-water EC (mS/cm) via the Hilhorst (2000) model.

    bulk_ec is temperature-normalized to 25 degC (2 %/K), the pore-water
    permittivity uses eps_p = 80.3 - 0.37*(T-20) and the bulk permittivity
    is estimated from VWC (inverse Topp). Returns None when the substrate
    is too dry for the model to be valid.
    """
    if not bulk_ec or vwc_pct is None or vwc_pct <= 0:
        return None
    ec25 = bulk_ec / (1.0 + 0.02 * (temp_c - 25.0))
    eps_p = 80.3 - 0.37 * (temp_c - 20.0)
    eb = _permittivity_from_vwc(vwc_pct)
    denom = eb - eps_offset
    if denom <= 0.5:
        return None
    return round(eps_p * ec25 / denom, 2)


def calculate_dli(ppfd: float, photoperiod_hours: float) -> float:
    """Daily Light Integral (mol/m²/d)."""
    return ppfd * 3600 * photoperiod_hours / 1_000_000


def calculate_shot_volume(pot_size_ml: float, percent: float = 1.0) -> float:
    """Shot volume (mL) for a given percentage of the pot volume."""
    return pot_size_ml * (percent / 100.0)


def status_in_range(value: float, low: float, high: float) -> str:
    """Return optimal/high/low for a target range."""
    if value < low:
        return STATUS_LOW
    if value > high:
        return STATUS_HIGH
    return STATUS_OPTIMAL


def analyze_runoff(
    runoff_ec: float,
    input_ec: float,
    target_ec: float,
    runoff_ph: float,
    input_ph: float,
) -> dict[str, str]:
    """Runoff analysis: EC trend, pH trend, nutrient recommendation.

    Returns a dict with keys: ec_trend, ph_trend, recommendation.
    """
    # EC trend
    if runoff_ec < input_ec:
        ec_trend = "substrate_ec_falling"
    elif abs(runoff_ec - input_ec) <= 0.1:
        ec_trend = "balanced"
    else:
        ec_trend = "ec_stacking"

    # pH trend
    if runoff_ph > input_ph:
        ph_trend = "normal"
    elif runoff_ph < input_ph:
        ph_trend = "check_rootzone"
    else:
        ph_trend = "stable"

    # Nutrient recommendation
    if runoff_ec > target_ec + EC_FLUSH_DELTA:
        recommendation = "flush"
    elif runoff_ph < input_ph:
        recommendation = "check_roots"
    elif runoff_ec > target_ec + EC_REDUCE_DELTA:
        recommendation = "reduce_ec"
    elif runoff_ec < target_ec and ph_trend == "normal":
        recommendation = "increase_ec"
    else:
        recommendation = "keep_ec"

    return {
        "ec_trend": ec_trend,
        "ph_trend": ph_trend,
        "recommendation": recommendation,
    }


def reservoir_pct_from_distance(
    distance: float, dist_empty: float, dist_full: float
) -> float | None:
    """Reservoir % from an ultrasonic/ToF distance (mm) via 2-point calibration.

    dist_empty = large distance (empty), dist_full = small distance (full).
    """
    span = dist_empty - dist_full
    if span <= 0:
        return None
    pct = (dist_empty - distance) / span * 100.0
    return max(0.0, min(100.0, pct))


def determine_p_phase(
    minutes_since_lights_on: float | None, photoperiod_h: float
) -> str:
    """Irrigation day phase P0-P3 based on the light schedule.

    P0 = night, P1 = ramp-up, P2 = maintenance, P3 = dryback before lights-off.
    minutes_since_lights_on = None -> lights off (P0).
    """
    if minutes_since_lights_on is None:
        return "P0"
    if minutes_since_lights_on < P1_DURATION_H * 60:
        return "P1"
    if minutes_since_lights_on > (photoperiod_h - P3_LEAD_H) * 60:
        return "P3"
    return "P2"


def next_training_event(flower_day: int, flower_days_total: int) -> dict | None:
    """Next training/harvest event from the current flower day.

    Returns {"event": key, "in_days": n, "day": target_flower_day} or None.
    """
    candidates: list[tuple[str, int]] = []
    for key, lo, _hi in TRAINING_EVENTS:
        candidates.append((key, lo))
    if flower_days_total > 0:
        candidates.append(("flush", max(1, flower_days_total - 7)))
        candidates.append(("harvest_check", flower_days_total))

    upcoming = [(k, d) for k, d in candidates if d >= flower_day]
    if not upcoming:
        return None
    key, day = min(upcoming, key=lambda x: x[1])
    return {"event": key, "in_days": day - flower_day, "day": day}
