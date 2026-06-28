# Contributing to Precision Grow

Thanks for helping improve Precision Grow! Contributions of all kinds are welcome —
code, blueprints, community strain data, documentation and bug reports.

## Ground rules

- **Language:** the codebase is **English only** (identifiers, comments, docstrings,
  strings, enum values). German (and other languages) live in `translations/`.
- **HACS-compliant:** keep `manifest.json` valid (domain `precision_grow`).
- **Home Assistant coding standards:** follow the
  [HA developer docs](https://developers.home-assistant.io/).
- **All sensor math lives in `const.py`** — keep formulas, targets, substrate data,
  shot volumes and presets centralized there.
- **Config Flow UI-first** — no YAML editing should be required for the user.
- **ESPHome configs** stay in the `/esphome` folder.

## Project structure

```
custom_components/precision_grow/
  __init__.py        # setup, coordinator wiring, services registration
  coordinator.py     # all calculations + persistent runtime state
  const.py           # formulas, targets, substrate data, shot volumes, presets
  config_flow.py     # 6-step wizard + clone path + options (incl. phase-target editor)
  sensor.py binary_sensor.py select.py number.py button.py text.py
  strain_api.py      # Cannlytics + community JSON lookup
  services.yaml services.py
  strings.json + translations/   # English base + locales
  data/strains_community.json
blueprints/automation/precision_grow/   # 9 blueprints
dashboards/precision_grow.yaml
esphome/
docs/
```

## Development setup

1. Clone into a HA dev environment under `config/custom_components/precision_grow`.
2. Python 3.11+ (HA core targets 3.12+). Avoid 3.12-only syntax where it can be
   trivially avoided (e.g. the `type X = ...` alias).
3. Quick local checks:
   ```bash
   python -m py_compile custom_components/precision_grow/*.py
   python -m json.tool custom_components/precision_grow/strings.json
   ```
4. Validate blueprints/dashboard YAML before opening a PR.

## Adding community strains

Edit `custom_components/precision_grow/data/strains_community.json`. Each entry:

```json
"gorilla-glue-4": {
  "name": "Gorilla Glue #4",
  "strain_type": "hybrid",      // indica | sativa | hybrid
  "plant_type": "regular",      // regular | auto  (optional)
  "veg_days": 28,
  "flower_days": 63,
  "thc": 25.0,
  "cbd": 0.1,
  "genetics": "Chem's Sister × Sour Dubb × Chocolate Diesel",
  "terpenes": ["caryophyllene", "limonene", "myrcene"]
}
```

`veg_days` / `flower_days` are guidance values — they vary by breeder/phenotype.

## Pull requests

- One focused change per PR; describe what and why.
- Keep enum values stable (they are matched by blueprints and the dashboard). If you
  must change one, update `const.py`, `sensor.py` options, the translations' `state`
  keys, the blueprints, and the dashboard together.
- Be cautious with destructive actions; the pump test is deliberately confirmation-gated.

## Reporting issues

Open an issue with your HA version, the integration version, relevant logs
(`custom_components.precision_grow`), and steps to reproduce.
