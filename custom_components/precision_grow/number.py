"""Number entities for Precision Grow (targets, power price, pot size)."""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass

from homeassistant.components.number import (
    NumberDeviceClass,
    NumberEntity,
    NumberEntityDescription,
    NumberMode,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import PrecisionGrowConfigEntry
from .const import (
    CONF_CONTAINER_SIZE_ML,
    CONF_FLOWER_PHOTOPERIOD,
    CONF_LEAF_OFFSET,
    CONF_PHOTOPERIOD,
    CONF_POWER_PRICE,
    CONF_TANK_VOLUME_L,
    DEFAULT_FLOWER_PHOTOPERIOD,
    DEFAULT_FLOWER_POSTPONE,
    DEFAULT_LEAF_OFFSET,
    DEFAULT_PHOTOPERIOD,
    DEFAULT_POWER_PRICE,
    DEFAULT_TANK_VOLUME_L,
    INPUT_HARVEST_DRY,
    INPUT_HARVEST_EXTRA,
    INPUT_HARVEST_WET,
    INPUT_RUNOFF_EC,
    INPUT_RUNOFF_PH,
    INPUT_RUNOFF_PPM,
    INPUT_RUNOFF_VOLUME,
    NUM_FLOWER_POSTPONE,
    NUM_LIGHT_DISTANCE,
    NUM_PPFD_AT_FULL,
    NUM_PPFD_MANUAL,
    NUM_PPFD_REF_DISTANCE,
)
from .coordinator import PrecisionGrowCoordinator
from .entity import PrecisionGrowEntity


@dataclass(frozen=True, kw_only=True)
class PGNumberDescription(NumberEntityDescription):
    """Number description with a default function."""

    default_fn: Callable[[PrecisionGrowCoordinator], float]


NUMBERS: tuple[PGNumberDescription, ...] = (
    PGNumberDescription(
        key=CONF_PHOTOPERIOD,
        translation_key="photoperiod",
        native_min_value=0,
        native_max_value=24,
        native_step=0.5,
        native_unit_of_measurement="h",
        mode=NumberMode.SLIDER,
        icon="mdi:timer-sand",
        default_fn=lambda c: float(c._opt(CONF_PHOTOPERIOD, DEFAULT_PHOTOPERIOD)),
    ),
    PGNumberDescription(
        key=CONF_FLOWER_PHOTOPERIOD,
        translation_key="flower_photoperiod",
        native_min_value=0,
        native_max_value=24,
        native_step=0.5,
        native_unit_of_measurement="h",
        mode=NumberMode.SLIDER,
        icon="mdi:weather-night",
        default_fn=lambda c: float(
            c._opt(CONF_FLOWER_PHOTOPERIOD, DEFAULT_FLOWER_PHOTOPERIOD)
        ),
    ),
    PGNumberDescription(
        key=CONF_LEAF_OFFSET,
        translation_key="leaf_offset",
        native_min_value=0,
        native_max_value=6,
        native_step=0.5,
        native_unit_of_measurement="°C",
        mode=NumberMode.SLIDER,
        icon="mdi:leaf",
        default_fn=lambda c: float(c._opt(CONF_LEAF_OFFSET, DEFAULT_LEAF_OFFSET)),
    ),
    PGNumberDescription(
        key=CONF_POWER_PRICE,
        translation_key="power_price",
        native_min_value=0,
        native_max_value=2,
        native_step=0.01,
        native_unit_of_measurement="€/kWh",
        mode=NumberMode.BOX,
        icon="mdi:currency-eur",
        default_fn=lambda c: float(c._opt(CONF_POWER_PRICE, DEFAULT_POWER_PRICE)),
    ),
    PGNumberDescription(
        key=CONF_CONTAINER_SIZE_ML,
        translation_key="container_size",
        native_min_value=100,
        native_max_value=50000,
        native_step=100,
        native_unit_of_measurement="mL",
        device_class=NumberDeviceClass.VOLUME_STORAGE,
        mode=NumberMode.BOX,
        icon="mdi:cup",
        default_fn=lambda c: float(c._opt(CONF_CONTAINER_SIZE_ML, 3000)),
    ),
    PGNumberDescription(
        key=CONF_TANK_VOLUME_L,
        translation_key="tank_volume",
        native_min_value=1,
        native_max_value=1000,
        native_step=1,
        native_unit_of_measurement="L",
        device_class=NumberDeviceClass.VOLUME_STORAGE,
        mode=NumberMode.BOX,
        icon="mdi:storage-tank",
        default_fn=lambda c: float(c._opt(CONF_TANK_VOLUME_L, DEFAULT_TANK_VOLUME_L)),
    ),
    PGNumberDescription(
        key=NUM_FLOWER_POSTPONE,
        translation_key="flower_postpone_days",
        native_min_value=1,
        native_max_value=30,
        native_step=1,
        native_unit_of_measurement="d",
        mode=NumberMode.BOX,
        icon="mdi:calendar-clock",
        default_fn=lambda c: float(
            c.state.get("numbers", {}).get(NUM_FLOWER_POSTPONE, DEFAULT_FLOWER_POSTPONE)
            or DEFAULT_FLOWER_POSTPONE
        ),
    ),
)


def _staged(coordinator: PrecisionGrowCoordinator, key: str) -> float:
    """Value of an input field from the coordinator state (default 0)."""
    return float(coordinator.state.get("numbers", {}).get(key, 0) or 0)


# Dashboard input fields (runoff and harvest forms)
INPUT_NUMBERS: tuple[PGNumberDescription, ...] = (
    PGNumberDescription(
        key=INPUT_RUNOFF_EC,
        translation_key="runoff_ec_input",
        native_min_value=0, native_max_value=10, native_step=0.1,
        native_unit_of_measurement="mS/cm", mode=NumberMode.BOX,
        icon="mdi:lightning-bolt-circle",
        default_fn=lambda c: _staged(c, INPUT_RUNOFF_EC),
    ),
    PGNumberDescription(
        key=INPUT_RUNOFF_PH,
        translation_key="runoff_ph_input",
        native_min_value=3, native_max_value=9, native_step=0.1,
        mode=NumberMode.BOX, icon="mdi:ph",
        default_fn=lambda c: _staged(c, INPUT_RUNOFF_PH),
    ),
    PGNumberDescription(
        key=INPUT_RUNOFF_VOLUME,
        translation_key="runoff_volume_input",
        native_min_value=0, native_max_value=5000, native_step=10,
        native_unit_of_measurement="mL", mode=NumberMode.BOX, icon="mdi:cup-water",
        default_fn=lambda c: _staged(c, INPUT_RUNOFF_VOLUME),
    ),
    PGNumberDescription(
        key=INPUT_RUNOFF_PPM,
        translation_key="runoff_ppm_input",
        native_min_value=0, native_max_value=5000, native_step=10,
        mode=NumberMode.BOX, icon="mdi:counter",
        default_fn=lambda c: _staged(c, INPUT_RUNOFF_PPM),
    ),
    PGNumberDescription(
        key=INPUT_HARVEST_WET,
        translation_key="harvest_wet_input",
        native_min_value=0, native_max_value=100000, native_step=1,
        native_unit_of_measurement="g", mode=NumberMode.BOX, icon="mdi:weight",
        default_fn=lambda c: _staged(c, INPUT_HARVEST_WET),
    ),
    PGNumberDescription(
        key=INPUT_HARVEST_DRY,
        translation_key="harvest_dry_input",
        native_min_value=0, native_max_value=100000, native_step=1,
        native_unit_of_measurement="g", mode=NumberMode.BOX, icon="mdi:weight",
        default_fn=lambda c: _staged(c, INPUT_HARVEST_DRY),
    ),
    PGNumberDescription(
        key=INPUT_HARVEST_EXTRA,
        translation_key="harvest_extra_input",
        native_min_value=0, native_max_value=10000, native_step=0.5,
        native_unit_of_measurement="€", mode=NumberMode.BOX, icon="mdi:cash",
        default_fn=lambda c: _staged(c, INPUT_HARVEST_EXTRA),
    ),
)

# PPFD model (settings)
PPFD_NUMBERS: tuple[PGNumberDescription, ...] = (
    PGNumberDescription(
        key=NUM_PPFD_AT_FULL,
        translation_key="ppfd_at_full",
        native_min_value=0, native_max_value=2000, native_step=10,
        native_unit_of_measurement="µmol/m²/s", mode=NumberMode.BOX,
        icon="mdi:brightness-7",
        default_fn=lambda c: _staged(c, NUM_PPFD_AT_FULL),
    ),
    PGNumberDescription(
        key=NUM_PPFD_REF_DISTANCE,
        translation_key="ppfd_ref_distance",
        native_min_value=0, native_max_value=200, native_step=1,
        native_unit_of_measurement="cm", mode=NumberMode.BOX,
        icon="mdi:arrow-expand-vertical",
        default_fn=lambda c: _staged(c, NUM_PPFD_REF_DISTANCE),
    ),
    PGNumberDescription(
        key=NUM_LIGHT_DISTANCE,
        translation_key="light_distance",
        native_min_value=0, native_max_value=200, native_step=1,
        native_unit_of_measurement="cm", mode=NumberMode.BOX,
        icon="mdi:arrow-up-down",
        default_fn=lambda c: _staged(c, NUM_LIGHT_DISTANCE),
    ),
    PGNumberDescription(
        key=NUM_PPFD_MANUAL,
        translation_key="ppfd_manual",
        native_min_value=0, native_max_value=2000, native_step=10,
        native_unit_of_measurement="µmol/m²/s", mode=NumberMode.BOX,
        icon="mdi:brightness-5",
        default_fn=lambda c: _staged(c, NUM_PPFD_MANUAL),
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrecisionGrowConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities(
        PrecisionGrowNumber(coordinator, desc)
        for desc in (*NUMBERS, *INPUT_NUMBERS, *PPFD_NUMBERS)
    )


class PrecisionGrowNumber(PrecisionGrowEntity, NumberEntity):
    """Einstellbarer Zahlenwert, persistiert im Coordinator-State."""

    entity_description: PGNumberDescription

    def __init__(
        self,
        coordinator: PrecisionGrowCoordinator,
        description: PGNumberDescription,
    ) -> None:
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.entry.entry_id}_{description.key}"

    @property
    def native_value(self) -> float:
        return self.entity_description.default_fn(self.coordinator)

    async def async_set_native_value(self, value: float) -> None:
        await self.coordinator.async_set_number(self.entity_description.key, value)
