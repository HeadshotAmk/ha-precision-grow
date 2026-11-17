# ESPHome sensor node

ESP32 D1 Mini (MH-ET LIVE MiniKit) on the Open Grow carrier board. All sensors plug in
via RJ45 patch cables; the HX711 boards and the ultrasonic driver sit next to their sensors.
Ultrasonic is used instead of a laser ToF sensor (laser reads water poorly).

## Hardware / wiring

RJ45 pinout on every port: 1 = 3.3 V, 2 = GND, 3 = signal A, 4 = signal B, 5/6/8 = GND, 7 = 5 V.

| Port | Sensor / actuator | Signal A | Signal B | Notes |
|---|---|---|---|---|
| J1 | SHT31 | SDA GPIO21 | SCL GPIO22 | 0x44, bus 50 kHz |
| J2 | Scale 1, HX711 | DOUT GPIO16 | CLK GPIO17 | one 10 kg full-bridge cell |
| J3 | Scale 2, HX711 | DOUT GPIO33 | CLK GPIO32 | one 10 kg full-bridge cell |
| J4 | AJ-SR04M ultrasonic (R7 open) | Trig GPIO26 | Echo GPIO27 | 5 V supply, echo divider on board, blind zone ~25 cm |
| J5 | I²C spare | SDA GPIO21 | SCL GPIO22 | |
| J6 | DS18B20 | 1-Wire GPIO4 | – | irrigation tank |
| J7 (RJ12) | Light dimmer 1-10 V | GPIO25 via PC817 | – | Mars Hydro FC3000, controller box on EXT |
| J8 (terminal) | Dimmer 2 (spare) | GPIO13 via PC817 | – | e.g. EC exhaust fan |
| J9 (terminal) | Float switch | GPIO14 | GND | humidifier box empty |

Light: the 1-10 V input never switches off (minimum ~10 %); switch the lamp with a smart
plug. Without the ESP the lamp runs at 100 %.

## Setup

1. Create `secrets.yaml` with `wifi_ssid`, `wifi_password`, `ap_password`, `api_encryption_key`, `ota_password`.
2. `esphome run grow_sensor_esp32.yaml`.
3. The device is auto-discovered by the ESPHome integration in Home Assistant.

## Calibrating the load cells (HX711)

The `calibrate_linear` values in the YAML must be adapted to each load cell:

1. Weigh the empty setup → note the raw value → set as `0.0 -> 0.0`.
2. Place a known weight (e.g. 1000 g) → note the raw value → set as `<raw> -> 1000.0`.

## Reservoir (ultrasonic)

No conversion needed in the ESPHome config — the sensor reports the distance in mm.
Mount it ~25 cm above the full water level (ultrasonic blind zone). The integration
calibrates 2-point via the buttons **"Calibrate Reservoir Empty"** (pump just barely
in the water) and **"Calibrate Reservoir Full"**, and derives % and liters from it
(tank volume in the settings). Any distance sensor that reports mm works here.
