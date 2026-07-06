"""Button entities for Precision Grow."""
from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import PrecisionGrowConfigEntry
from .const import (
    INPUT_HARVEST_DRY,
    INPUT_HARVEST_EXTRA,
    INPUT_HARVEST_WET,
    INPUT_RUNOFF_EC,
    INPUT_RUNOFF_PH,
    INPUT_RUNOFF_PPM,
    INPUT_RUNOFF_VOLUME,
    PHASES,
)
from .coordinator import PrecisionGrowCoordinator
from .entity import PrecisionGrowEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PrecisionGrowConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities(
        [
            AdvancePhaseButton(coordinator),
            ResetDrybackButton(coordinator),
            CalibrateFieldCapacityButton(coordinator),
            CalibrateDryWeightButton(coordinator),
            CalibrateReservoirEmptyButton(coordinator),
            CalibrateReservoirFullButton(coordinator),
            SubmitRunoffButton(coordinator),
            SubmitHarvestButton(coordinator),
            LogExtraCostButton(coordinator),
            ExportCsvButton(coordinator),
            SaveDiaryButton(coordinator),
            TestSetupButton(coordinator),
            TestPumpButton(coordinator),
            ArchiveGrowButton(coordinator),
            CompareGrowsButton(coordinator),
            ConfirmFlowerSwitchButton(coordinator),
            PostponeFlowerSwitchButton(coordinator),
        ]
    )


class AdvancePhaseButton(PrecisionGrowEntity, ButtonEntity):
    """Move to the next growth phase."""

    _attr_translation_key = "advance_phase"
    _attr_icon = "mdi:skip-next"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_advance_phase"

    async def async_press(self) -> None:
        current = self.coordinator.phase
        idx = PHASES.index(current) if current in PHASES else 0
        nxt = PHASES[min(idx + 1, len(PHASES) - 1)]
        await self.coordinator.async_set_phase(nxt)


class ResetDrybackButton(PrecisionGrowEntity, ButtonEntity):
    """Manually reset dryback peak/trough (e.g. after irrigation)."""

    _attr_translation_key = "reset_dryback"
    _attr_icon = "mdi:restart"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_reset_dryback"

    async def async_press(self) -> None:
        self.coordinator.state["peak_weight"] = None
        self.coordinator.state["trough_weight"] = None
        self.coordinator.state["peak_day"] = None
        await self.coordinator.async_save_state()
        await self.coordinator.async_request_refresh()


class CalibrateFieldCapacityButton(PrecisionGrowEntity, ButtonEntity):
    """Store the current weight as field capacity (saturated)."""

    _attr_translation_key = "calibrate_field_capacity"
    _attr_icon = "mdi:scale-balance"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_cal_fc"

    async def async_press(self) -> None:
        await self.coordinator.async_calibrate_field_capacity()


class CalibrateDryWeightButton(PrecisionGrowEntity, ButtonEntity):
    """Store the current weight as dry weight."""

    _attr_translation_key = "calibrate_dry_weight"
    _attr_icon = "mdi:scale"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_cal_dry"

    async def async_press(self) -> None:
        await self.coordinator.async_calibrate_dry_weight()


class CalibrateReservoirEmptyButton(PrecisionGrowEntity, ButtonEntity):
    """Calibrate the reservoir distance with an empty tank."""

    _attr_translation_key = "calibrate_reservoir_empty"
    _attr_icon = "mdi:cup-off-outline"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_cal_res_empty"

    async def async_press(self) -> None:
        await self.coordinator.async_calibrate_reservoir("empty")


class CalibrateReservoirFullButton(PrecisionGrowEntity, ButtonEntity):
    """Calibrate the reservoir distance with a full tank."""

    _attr_translation_key = "calibrate_reservoir_full"
    _attr_icon = "mdi:cup-water"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_cal_res_full"

    async def async_press(self) -> None:
        await self.coordinator.async_calibrate_reservoir("full")


class SubmitRunoffButton(PrecisionGrowEntity, ButtonEntity):
    """Save runoff from the input fields (calls log_runoff)."""

    _attr_translation_key = "submit_runoff"
    _attr_icon = "mdi:content-save"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_submit_runoff"

    async def async_press(self) -> None:
        nums = self.coordinator.state.get("numbers", {})
        await self.coordinator.async_log_runoff(
            runoff_ec=float(nums.get(INPUT_RUNOFF_EC, 0) or 0),
            runoff_ph=float(nums.get(INPUT_RUNOFF_PH, 0) or 0),
            volume_ml=float(nums.get(INPUT_RUNOFF_VOLUME, 0) or 0) or None,
            ppm=float(nums.get(INPUT_RUNOFF_PPM, 0) or 0) or None,
        )


class SubmitHarvestButton(PrecisionGrowEntity, ButtonEntity):
    """Save harvest from the input fields (calls set_harvest)."""

    _attr_translation_key = "submit_harvest"
    _attr_icon = "mdi:content-save-check"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_submit_harvest"

    async def async_press(self) -> None:
        nums = self.coordinator.state.get("numbers", {})
        await self.coordinator.async_set_harvest(
            wet_g=float(nums.get(INPUT_HARVEST_WET, 0) or 0),
            dry_g=float(nums.get(INPUT_HARVEST_DRY, 0) or 0),
            extra_cost=float(nums.get(INPUT_HARVEST_EXTRA, 0) or 0),
        )


class LogExtraCostButton(PrecisionGrowEntity, ButtonEntity):
    """Add the staged extra-cost amount to the running cost log."""

    _attr_translation_key = "log_extra_cost"
    _attr_icon = "mdi:cash-plus"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_log_extra_cost"

    async def async_press(self) -> None:
        nums = self.coordinator.state.get("numbers", {})
        await self.coordinator.async_add_extra_cost(
            float(nums.get(INPUT_HARVEST_EXTRA, 0) or 0)
        )


class ExportCsvButton(PrecisionGrowEntity, ButtonEntity):
    """Export grow data as CSV (to the media folder / config/www)."""

    _attr_translation_key = "export_csv"
    _attr_icon = "mdi:file-export"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_export_csv"

    async def async_press(self) -> None:
        await self.coordinator.async_export_and_notify()


class SaveDiaryButton(PrecisionGrowEntity, ButtonEntity):
    """Assign comment + image to today's diary entry."""

    _attr_translation_key = "save_diary"
    _attr_icon = "mdi:notebook-plus"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_save_diary"

    async def async_press(self) -> None:
        await self.coordinator.async_save_diary_today()


class TestSetupButton(PrecisionGrowEntity, ButtonEntity):
    """Test all sensors/devices (excluding the pump)."""

    _attr_translation_key = "test_setup"
    _attr_icon = "mdi:clipboard-check"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_test_setup"

    async def async_press(self) -> None:
        await self.coordinator.async_test_setup(include_pump=False)


class TestPumpButton(PrecisionGrowEntity, ButtonEntity):
    """Test the pump — trigger only after the safety confirmation in the dashboard."""

    _attr_translation_key = "test_pump"
    _attr_icon = "mdi:water-pump"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_test_pump"

    async def async_press(self) -> None:
        await self.coordinator.async_test_pump()


class ArchiveGrowButton(PrecisionGrowEntity, ButtonEntity):
    """Copy the current grow to the archive (Synology)."""

    _attr_translation_key = "archive_grow"
    _attr_icon = "mdi:archive-arrow-down"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_archive_grow"

    async def async_press(self) -> None:
        await self.coordinator.async_archive_grow()


class CompareGrowsButton(PrecisionGrowEntity, ButtonEntity):
    """Start the A/B comparison of the selected grows."""

    _attr_translation_key = "compare_grows"
    _attr_icon = "mdi:compare"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_compare_grows"

    async def async_press(self) -> None:
        await self.coordinator.async_compare()


class ConfirmFlowerSwitchButton(PrecisionGrowEntity, ButtonEntity):
    """Confirm the 12/12 switch into flowering (regular plants)."""

    _attr_translation_key = "confirm_flower_switch"
    _attr_icon = "mdi:flower"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_confirm_flower"

    async def async_press(self) -> None:
        await self.coordinator.async_confirm_flower_switch()


class PostponeFlowerSwitchButton(PrecisionGrowEntity, ButtonEntity):
    """Postpone the flower switch by the configured number of days."""

    _attr_translation_key = "postpone_flower_switch"
    _attr_icon = "mdi:calendar-clock"

    def __init__(self, coordinator: PrecisionGrowCoordinator) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{coordinator.entry.entry_id}_postpone_flower"

    async def async_press(self) -> None:
        await self.coordinator.async_postpone_flower_switch()
