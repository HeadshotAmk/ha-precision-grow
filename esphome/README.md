# ESPHome sensor node

ESP32 D1 Mini with all hardware sensors for Precision Grow.

## Hardware / wiring

| Sensor | Bus / pin | Address | Function |
|---|---|---|---|
| SHT31 | I2C (SDA GPIO21, SCL GPIO22) | 0x44 | Temperature + humidity |
| HX711 + 10kg load cell | DOUT GPIO16, CLK GPIO17 | – | Load cell (dryback/transpiration) |
| VL53L0X | I2C (SDA GPIO21, SCL GPIO22) | 0x29 | Reservoir level (ToF, mm) |
| Float switch | GPIO14 (pullup) | – | Humidifier tank empty |

## Setup

1. Create `secrets.yaml` with `wifi_ssid`, `wifi_password`, `ap_password`, `api_encryption_key`, `ota_password`.
2. `esphome run grow_sensor_esp32.yaml`.
3. The device is auto-discovered by the ESPHome integration in Home Assistant.

## Calibrating the load cell (HX711)

The `calibrate_linear` values in the YAML must be adapted to your load cell:

1. Weigh the empty setup → note the raw value → set as `0.0 -> 0.0`.
2. Place a known weight (e.g. 1000 g) → note the raw value → set as `<raw> -> 1000.0`.

## Reservoir (VL53L0X)

No conversion needed in the ESPHome config — the sensor reports the distance in mm.
The integration calibrates 2-point via the buttons **"Calibrate Reservoir Empty"**
(pump just barely in the water) and **"Calibrate Reservoir Full"**, and derives
% and liters from it (tank volume in the settings).
