# Precision Grow

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

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
- **Reservoir:** ultrasonic (JSN-SR04T) distance → % and liters via 2-point calibration, low/critical alerts
- **Irrigation safety layer (fail-safe):** kill switch, hard max-shot watchdog (forces the
  pump off), daily shot/runtime caps, anti-drown gate (weight vs field capacity) and
  reservoir dry-run protection — enforced in the integration, independent of any automation
- **Substrate sensors (optional):** map a VWC/EC probe (TEROS-12, THC-S, TDR) and the
  integration switches the dryback source from weight to **VWC (percentage points below
  the daily peak)** and computes **pore-water EC** (Hilhorst model) for EC steering
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
   reservoir distance (JSN-SR04T ultrasonic), CO₂, PPFD, EC, pH, light brightness, plus heater, cooler,
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
| JSN-SR04T (ultrasonic) | trigger/echo | Reservoir level (distance → % → L) |
| Float switch | GPIO | Humidifier tank empty |
| THC-S (RS485 Modbus, optional) | UART | Substrate VWC + bulk EC + temp → pore EC ([`esphome/substrate_sensor_thcs.yaml`](esphome/substrate_sensor_thcs.yaml)) |

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
| `phase_switch_reminder` | Athena-style phase-length reminders (clone/stretch/bulk/ripen/drying) |
| `co2_control` | Day/night CO2 setpoint with hysteresis + **1800 ppm safety cutoff** |

---

## Dashboard

A complete 6-tab Mushroom + ApexCharts dashboard is in
[`dashboards/precision_grow.yaml`](dashboards/precision_grow.yaml)
(Overview, Irrigation, Nutrients, Energy & cost, Grow log, Settings).

**Prerequisites (HACS frontend):** [Mushroom](https://github.com/piitaya/lovelace-mushroom)
and [ApexCharts Card](https://github.com/RomRider/apexcharts-card).
Replace the `grow1` prefix with your grow's slug.

---

## Telegram alerts (no open ports)

All Precision Grow alerts (irrigation safety, pump watchdog, setup/pump tests, CSV export,
archive, comparisons — plus every blueprint notification) can be pushed to a Telegram bot.
Telegram is **outbound only**: Home Assistant connects to the Telegram API, so you do
**not** need port forwarding, a public URL or any inbound access to your instance.

### 1. Create the bot

1. In Telegram, open a chat with [@BotFather](https://t.me/BotFather) and send `/newbot`.
   Follow the prompts and store the **API token**.
2. Get your **chat ID**: send any message to [@id_bot](https://t.me/id_bot) and note the ID.
3. Open the link BotFather gave you for your new bot and send `/start`
   (bots cannot message you before you started the chat).

### 2. Add the Telegram bot integration in HA

1. **Settings → Devices & services → Add integration → "Telegram bot"**.
2. Platform: **Broadcast** (send-only — nothing is exposed, not even polling).
3. Paste the **API token**, leave the API endpoint at the default.
4. After setup, open the integration entry → three-dots menu → **Add allowed chat ID**
   and enter your chat ID.
5. HA creates a notify entity per chat, e.g. `notify.<botname>_<chat>`
   (check **Settings → Devices & services → Entities**, filter "notify").

No `configuration.yaml` editing is required — this is all UI (HA 2024.8+).

### 3. Point Precision Grow at the bot

**Integration alerts:** Settings → Devices & services → Precision Grow → **Configure**
→ *General settings* → **Push alerts to** → enter the notify entity, e.g.:

```text
notify.growbot_123456789
```

Alternatively enter an action like `telegram_bot.send_message`
(broadcasts to **all** allowed chat IDs) or a legacy notifier `notify.<name>`.
Leave empty to keep banner-only notifications.

**Blueprint alerts** (reservoir, training, flower/phase switch, …): set the
*Notify service* input of the blueprint to `telegram_bot.send_message`.

### 4. Test

Developer tools → Actions → `notify.send_message` with your notify entity, or press
**Test setup** on the dashboard — the result should arrive in Telegram.

## Known issues & limitations

- **VWC/EC substrate sensors and the CO2 blueprint are implemented to spec but not yet
  validated on real hardware** (the maintainer runs a load-cell setup). Feedback from
  real TDR/CO2 setups is very welcome — see "Support the project".
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

## Support the project

Precision Grow is free and open source (GPLv3), built and tested on hobby hardware.
If it saves your grow (or your wallet), you can support development:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Buy%20me%20a%20coffee-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/headshotamk)

Hardware donations (VWC/EC substrate probes, CO2 gear) help the most — those
features are currently implemented to spec but untested on real hardware.
Bug reports from real setups are just as valuable: please open an
[issue](https://github.com/HeadshotAmk/ha-precision-grow/issues).

## License

GPLv3 — see [LICENSE](LICENSE). Contributions welcome, see [CONTRIBUTING.md](CONTRIBUTING.md).
