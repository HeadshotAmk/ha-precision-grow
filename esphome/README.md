# ESPHome sensor node

ESP32 D1 Mini with all hardware sensors for Precision Grow.

## Hardware / wiring

| Sensor | Bus / pin | Address | Function |
|---|---|---|---|
| SHT31 | I2C (SDA GPIO21, SCL GPIO22) | 0x44 | Temperature + humidity |
| HX711 + 2× 10kg load cells | DOUT GPIO16, CLK GPIO17 | – | Load cell (dryback/transpiration) |
| JSN-SR04T (ultrasonic) | trigger GPIO5, echo GPIO18 | – | Reservoir level (distance, mm) |
| Float switch | GPIO14 (pullup) | – | Humidifier tank empty |

Two 10 kg half-bridge load cells combine into one full bridge on a single HX711.
The JSN-SR04T echo pin is 5 V — add a voltage divider (e.g. 1k/2k) to the ESP32.
Ultrasonic is used instead of a laser ToF sensor (laser reads water poorly).

## Setup

1. Create `secrets.yaml` with `wifi_ssid`, `wifi_password`, `ap_password`, `api_encryption_key`, `ota_password`.
2. `esphome run grow_sensor_esp32.yaml`.
3. The device is auto-discovered by the ESPHome integration in Home Assistant.

## Calibrating the load cell (HX711)

The `calibrate_linear` values in the YAML must be adapted to your load cell:

1. Weigh the empty setup → note the raw value → set as `0.0 -> 0.0`.
2. Place a known weight (e.g. 1000 g) → note the raw value → set as `<raw> -> 1000.0`.

## Reservoir (JSN-SR04T ultrasonic)

No conversion needed in the ESPHome config — the sensor reports the distance in mm.
Mount it ~25 cm above the full water level (ultrasonic blind zone). The integration
calibrates 2-point via the buttons **"Calibrate Reservoir Empty"** (pump just barely
in the water) and **"Calibrate Reservoir Full"**, and derives % and liters from it
(tank volume in the settings). Any distance sensor that reports mm works here.
