# Setup guide

Complete walkthrough from installation to a working dashboard.

## 1. Install

Via HACS (custom repository, category Integration) or by copying
`custom_components/precision_grow` into `config/custom_components/`. Restart Home Assistant.

## 2. Add the integration

Settings → Devices & Services → **Add Integration** → *Precision Grow*.
You first choose:

- **New grow** — the full 6-step wizard.
- **Clone grow (template/archive)** — copy all settings from an active grow or an
  archived grow on your Synology; you only set a new name, propagation and age.

## 3. The wizard

1. **Basics** — grow name, *started from* (seed/clone), plant age (days; the start date
   is derived from it), number of plants, substrate, container/pot size, **lights-on time**,
   power price (€/kWh).
2. **Strain** — type a name to auto-fill metadata via Cannlytics (no key), or tick
   *skip lookup* to enter manually.
3. **Confirm strain** — **plant type (regular / autoflower)**, veg time, flower time,
   THC/CBD. These drive the phase timing and the flowering photoperiod.
4. **Sensor mapping** (all optional) — temperature, humidity, weight (load cell),
   reservoir level/distance, CO₂, PPFD, EC, pH, water temperature, light brightness,
   plus the reservoir tank volume (L).
5. **Device mapping** (all optional) — heater, cooler, humidifier, dehumidifier,
   irrigation pump, light, exhaust fan, CO₂ valve.
6. **Power monitoring** — pick the power sensors to track energy/cost.
7. **Storage** — photo target and the **media base path** (e.g. `/media/synology`).

## 4. Synology / media (diary photos, CSV, archive)

To store diary photos, CSV exports and grow archives on your NAS (and keep the Pi small):

1. In Home Assistant: **Settings → System → Storage → Add network storage** (SMB/NFS),
   usage **Media**. The share then appears as a path like `/media/synology`.
2. Set that path as the **media base path** in the integration's Storage step.

The integration creates `/<media>/<grow>/media` and `/<media>/<grow>/archive` per grow.
Diary photos are renamed to `<grow>-tag-<day>.<ext>` on the NAS; a small thumbnail is
written to `/config/www/precision_grow/<grow>/` for inline display in the diary.

## 5. PPFD / DLI without a PAR sensor

If you don't have a quantum sensor, map your light's **brightness** entity and set, in
the Settings tab:

- **PPFD at 100 %** — measure once with e.g. the Photone app at canopy height.
- **PPFD calibration distance** — the distance at which you measured.
- **Light distance (current)** — updated whenever you raise/lower the light.

PPFD is then estimated as `PPFD@100% × brightness% × (cal_distance / current_distance)²`.
Alternatively set **PPFD manual**. Priority: real PAR sensor → estimate → manual.

## 6. Regular vs autoflower & the 12/12 switch

- **Autoflower:** the photoperiod stays constant; the plant flowers by age.
- **Regular:** when the configured veg time is reached, `binary_sensor.<grow>_flower_switch_due`
  turns on and a reminder appears. Nothing switches automatically — you **confirm** the
  switch to flowering or **postpone** it by the configured number of days (Settings →
  *Flower postpone (days)*). Import the `flower_switch_reminder` blueprint for push +
  banner with actionable buttons.

## 7. ESPHome (optional reference hardware)

See [`esphome/README.md`](../esphome/README.md). One ESP32 carries SHT31, HX711 load
cell, VL53L0X (reservoir) and a float switch. The VL53L0X reports distance in mm; calibrate
empty/full from the integration's buttons.

## 8. Blueprints

Import the blueprints you want from `blueprints/automation/precision_grow/` (Settings →
Automations → Blueprints → Import). Each one filters entities to this integration, so you
just pick the relevant grow's entities.

> Use **either** the `flower_switch_reminder` (manual confirm, recommended for regular)
> **or** the `phase_scheduler` auto-flip — not both.

## 9. Dashboard

Install the **Mushroom** and **ApexCharts Card** frontend resources via HACS, then add a
new dashboard from YAML using [`dashboards/precision_grow.yaml`](../dashboards/precision_grow.yaml).
Replace every `grow1` with your grow's slug (find/replace). Verify the exact entity IDs
under Developer Tools → States.

## 10. Calibration checklist

- **Field capacity:** water to runoff, let drain ~20–30 min, press *Calibrate Field Capacity*.
- **Dry weight (optional):** press *Calibrate Dry Weight* at your driest acceptable point →
  unlocks true substrate water-content dryback.
- **Reservoir:** press *Calibrate Reservoir Empty* (pump just covered) and
  *Calibrate Reservoir Full*.
- **Load cell (HX711):** set the two `calibrate_linear` points in the ESPHome config.
