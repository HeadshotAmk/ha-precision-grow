# Precision Grow

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-featured, user-friendly Home Assistant integration for indoor growers — an
open-source alternative to commercial controllers like TrolMaster, Growlink and
Argus Controls.

Precision Grow turns your existing sensors and smart plugs into a precision grow
controller: it calculates VPD/LVPD, DLI, substrate dryback and transpiration,
tracks phases and irrigation day-phases (P0–P3), gives nutrient recommendations
from runoff readings, tracks energy cost and cost-per-gram, and ships ready-made
automation blueprints and a complete Mushroom + ApexCharts dashboard.

> ⚠️ **Disclaimer:** This software is provided as-is for home/hobby use. Growing
> cannabis is regulated differently around the world — comply with your local laws.

---

## Features

- **Climate:** VPD, Leaf VPD, DLI (with target band), per-phase status (optimal/high/low)
- **Substrate / irrigation:** dryback %, dryback rate (%/h), transpiration (g/h),
  shot volume (weight-based when a load cell is present), P0–P3 day-phase, runoff targets
- **Field Capacity (hybrid):** automatic daily peak + optional manual calibration
  (field capacity / dry weight) for true substrate water content
- **PPFD without a PAR sensor:** estimate from light brightness % with a one-time
  calibration (PPFD @ 100 % + distance, inverse-square corrected), or enter it manually
- **Auto vs regular:** plant type aware. Regular plants get a **manual 12/12 confirmation
  reminder** (confirm or postpone X days); autoflowers keep a constant photoperiod
- **Nutrients:** manual runoff entry → EC/pH trend analysis and a nutrient
  recommendation (increase / keep / reduce EC, flush, check roots)
- **Energy & cost:** kWh per device, running cost, daily cost, and €/g after harvest
- **Reservoir:** VL53L0X distance → % and liters via 2-point calibration, low/critical alerts
- **Grow diary:** automatic daily value snapshots + your comment and photo per day,
  stored on your Synology with on-device thumbnails
- **Archive, clone & A/B compare:** archive a finished grow to your NAS, clone any
  active or archived grow as a template, and compare two grows side by side
- **Test my Setup:** one click measures and validates every mapped sensor/device
  (humidifier raises RH, heater raises temp, …); the pump test is guarded by a
  confirmation and validated via the falling reservoir level
- **9 automation blueprints** and a **6-tab dashboard** included

---

## Installation (HACS)

1. HACS → Integrations → ⋮ → **Custom repositories**
2. Add `https://github.com/HeadshotAmk/ha-precision-grow` as category **Integration**
3. Install **Precision Grow**, then restart Home Assistant
4. Settings → Devices & Services → **Add Integration** → *Precision Grow*

Manual install: copy `custom_components/precision_grow` into your `config/custom_components/` and restart.

---

## Quick start

1. **Add the integration.** Choose **New grow** (or **Clone grow** from a template/archive).
2. **Basics:** name, seed/clone, plant age, substrate, container/pot size, lights-on time, power price.
3. **Strain:** type a name for automatic metadata (Cannlytics, no key) or skip; then confirm
   **plant type (regular/auto)**, **veg/flower time**, THC/CBD.
4. **Map your sensors and devices** (all optional): temperature, humidity, weight (HX711),
   reservoir distance (VL53L0X), CO₂, PPFD, EC, pH, light brightness, plus heater, cooler,
   humidifier, pump, light, exhaust, …
5. **Storage:** set the media base path (e.g. your Synology mount `/media/synology`).
6. Import the **blueprints** you want and add the **dashboard**.

See [docs/setup.md](docs/setup.md) for the full walkthrough and [docs/sensors.md](docs/sensors.md)
for the complete entity reference.

---

## Hardware (reference setup)

All sensors on a single ESP32 (see [`esphome/`](esphome/)):

| Sensor | Bus / pin | Function |
|---|---|---|
| SHT31 | I²C 0x44 | Temperature + humidity |
| HX711 + load cell | DOUT/CLK | Weight → dryback / transpiration |
| VL53L0X (ToF) | I²C 0x29 | Reservoir level (distance → % → L) |
| Float switch | GPIO | Humidifier tank empty |

The integration is device-agnostic — any sensor/switch entity works. Example: a
**Mars Hydro FC** light (via its HACS integration) maps to the *Light* device and the
*Light brightness* source; an **AC Infinity** humidifier, **Shelly** plugs, etc.

---

## Strain data

Flowering/veg time is **breeder-/seed-specific and not available in any free API**, so
Precision Grow uses **manual entry as the primary source** (from your seed packet),
pre-filled with sensible defaults and an extensible community database
([`custom_components/precision_grow/data/strains_community.json`](custom_components/precision_grow/data/strains_community.json)).
**Cannlytics** (free, no key) is used only for metadata enrichment (THC/CBD/terpenes/effects).

---

## Blueprints

Import from `blueprints/automation/precision_grow/`:

| Blueprint | Purpose |
|---|---|
| `vpd_climate_control` | Humidifier/dehumidifier/heater by VPD status |
| `dryback_irrigation` | Pump shots by dryback target, only in P1/P2 |
| `phase_scheduler` | Light follows the photoperiod (optional auto veg→flower) |
| `flower_switch_reminder` | **Manual 12/12 confirm** with postpone (regular plants) |
| `light_autodim` | Brightness per phase (e.g. Mars Hydro) |
| `training_reminders` | Lollipopping / defoliation / flush / harvest reminders |
| `reservoir_alert` | Low/critical reservoir notifications |
| `drying_phase_control` | RH/temp control during drying |
| `daily_runoff_reminder` | Daily reminder to measure runoff |

---

## Dashboard

A complete 6-tab Mushroom + ApexCharts dashboard is in
[`dashboards/precision_grow.yaml`](dashboards/precision_grow.yaml)
(Overview, Irrigation, Nutrients, Energy & cost, Grow log, Settings).

**Prerequisites (HACS frontend):** [Mushroom](https://github.com/piitaya/lovelace-mushroom)
and [ApexCharts Card](https://github.com/RomRider/apexcharts-card).
Replace the `grow1` prefix with your grow's slug.

---

## Known issues & limitations

- **Photo upload:** Home Assistant core has no generic file-upload card. Diary photos
  are referenced by path/URL (upload via the HA media browser into the grow's media
  folder); the integration then renames the file and creates an on-device thumbnail.
- **Device test safety:** `test_setup` / `test_pump` switch devices on for a few seconds
  and turn them off again in a `finally` block, with an additional `async_call_later`
  watchdog that force-offs the device shortly after the planned duration (covers
  cancellation/reload). A full Home Assistant **process crash** during the test could
  still leave a device on — for the pump this is flooding-relevant, so always place the
  sprinklers in a container before running the pump test (the service warns you) and keep
  the duration short.
- **Single instance per grow:** no `unique_id` duplicate detection — this is intentional
  to allow multiple grows.
- **Cloud light (e.g. Mars Hydro):** if you map a cloud-based light, automations depend
  on that cloud + internet connection.

## License

MIT — see [LICENSE](LICENSE). Contributions welcome, see [CONTRIBUTING.md](CONTRIBUTING.md).
