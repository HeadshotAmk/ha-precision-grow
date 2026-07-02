# Entity reference

All entities are grouped under one device per grow. Object IDs are derived from the
device name + entity name (examples below use the `grow1` prefix).

## Sensors

### Climate (passed through)
| Entity | Unit | Notes |
|---|---|---|
| `temperature` | °C | from the mapped temperature sensor |
| `humidity` | % | from the mapped humidity sensor |
| `co2` | ppm | from the mapped CO₂ sensor |
| `ppfd` | µmol/m²/s | resolved: PAR sensor → brightness estimate → manual (`source` attribute) |
| `brightness_pct` | % | light brightness; `target` attribute = recommended per phase |

### Climate (calculated)
| Entity | Unit | Notes |
|---|---|---|
| `vpd` | kPa | room VPD |
| `lvpd` | kPa | leaf VPD (leaf = air − offset) |
| `vpd_status` | enum | optimal / high / low (vs phase target) |
| `dli` | mol/m²/d | attributes: `target_min`, `target_max`, `percent_of_target` |
| `dli_status` | enum | optimal / high / low |
| `co2_status` | enum | optimal / high / low |

### Substrate / irrigation
| Entity | Unit | Notes |
|---|---|---|
| `dryback_pct` | % | vs daily peak/trough, or vs calibrated FC+dry weight |
| `dryback_status` | enum | optimal / high (too wet) / low (too dry) |
| `dryback_rate` | %/h | from the weight time series |
| `transpiration_rate` | g/h | smoothed weight loss during the photoperiod |
| `weight` | g | load cell |
| `p_phase` | enum | P0 night · P1 ramp · P2 maintenance · P3 dryback |
| `shot_volume` | mL | weight-based deficit to field capacity, else %-of-pot |

### Reservoir
| Entity | Unit | Notes |
|---|---|---|
| `reservoir_pct` | % | from ultrasonic (JSN-SR04T) distance via 2-point calibration |
| `reservoir_liters` | L | `reservoir_pct × tank volume` |
| `reservoir_status` | enum | ok / low / critical |

### Nutrients (live)
| Entity | Unit | Notes |
|---|---|---|
| `ec` | mS/cm | inline EC (optional) |
| `ph` | — | inline pH (optional) |
| `water_temp` | °C | hydro water temperature (optional) |
| `nutrient_recommendation` | enum | increase_ec / keep_ec / reduce_ec / flush / check_roots; attrs hold the last runoff |

### Growth & light
| Entity | Unit | Notes |
|---|---|---|
| `phase` | enum | clone / veg / stretch / bulk / ripen / drying |
| `day_total` | d | days since start |
| `day_in_phase` / `week_in_phase` | d / # | since last phase change |
| `flower_day` | d | since entering stretch |
| `next_training_event` | enum | lollipopping / defoliation_1 / defoliation_2 / flush / harvest_check (attr `in_days`) |
| `light_elapsed_pct` | % | photoperiod progress; attrs: `light_on`, `lights_on_time`, `lights_off_time`, `light_elapsed_min`, `light_remaining_min` |
| `light_remaining` | min | until lights-off (or next on) |

### Energy & management
| Entity | Unit | Notes |
|---|---|---|
| `energy_total_kwh` | kWh | sum of mapped power sensors; attr `energy_by_device` |
| `energy_cost_eur` | € | total |
| `daily_cost_eur` | € | per day |
| `cost_per_gram` | €/g | after harvest |
| `test_status` | enum | pass / warning / fail / running; attrs hold full results |
| `comparison` | text | "A vs B"; attrs hold rows + both summaries |
| `diary_count` | entries | attr `entries` = diary list (date, snapshot, comment, thumb) |

## Binary sensors
| Entity | Notes |
|---|---|
| `flower_switch_due` | on when a regular plant reached veg time and awaits the 12/12 confirm |

## Select
| Entity | Notes |
|---|---|
| `phase` | set the growth phase |
| `compare_a` / `compare_b` | pick grows for the A/B comparison |

## Numbers
Settings: `photoperiod`, `flower_photoperiod`, `leaf_offset`, `power_price`,
`container_size`, `tank_volume`, `flower_postpone_days`,
`ppfd_at_full`, `ppfd_ref_distance`, `light_distance`, `ppfd_manual`.
Inputs (forms): `runoff_ec_input`, `runoff_ph_input`, `runoff_volume_input`,
`runoff_ppm_input`, `harvest_wet_input`, `harvest_dry_input`, `harvest_extra_input`.

## Buttons
`advance_phase`, `reset_dryback`, `calibrate_field_capacity`, `calibrate_dry_weight`,
`calibrate_reservoir_empty`, `calibrate_reservoir_full`, `submit_runoff`,
`submit_harvest`, `export_csv`, `save_diary`, `test_setup`, `test_pump`, `archive_grow`,
`compare_grows`, `confirm_flower_switch`, `postpone_flower_switch`.

## Text
`diary_comment`, `diary_image` (path/URL for the day's photo).

## Services
`precision_grow.log_runoff`, `set_phase`, `advance_phase`, `set_harvest`,
`add_diary_entry`, `export_csv`, `archive_grow`, `test_setup`, `test_pump`,
`confirm_flower_switch`, `postpone_flower_switch`. All accept an optional `entry_id`
(otherwise they apply to all configured grows). See `services.yaml` for fields.
