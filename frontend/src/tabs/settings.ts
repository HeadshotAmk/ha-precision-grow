// Settings tab: everything the integration lets you set or calibrate.

import { html, nothing } from "lit";
import "../confirm-button";
import { numberField, pressButton, selectApply, timeField, type Ctx, type Tpl } from "../ctx";

function sourceValue(c: Ctx, sourceKey: string, decimals = 0): string {
  const id = c.grow.sources?.[sourceKey];
  const st = id ? c.hass.states[id] : undefined;
  if (!st) return "–";
  const v = parseFloat(st.state);
  if (!isFinite(v)) return st.state;
  const unit = st.attributes.unit_of_measurement ?? "";
  return `${c.number(v, decimals)} ${unit}`.trim();
}

function stored(c: Ctx, key: string, unit: string, decimals = 0): string {
  const v = c.grow.calibration?.[key];
  return v == null ? "–" : `${c.number(v, decimals)} ${unit}`;
}

function lightCard(c: Ctx): Tpl {
  const t = c.t;
  return html`<div class="card">
    <h2>${t.settings_light}</h2>
    <div class="fields">
      ${timeField(c, "lights_on", t.lights_on)}
      ${numberField(c, "photoperiod_hours", t.photoperiod)}
      ${numberField(c, "flower_photoperiod", t.flower_photoperiod)}
    </div>
    <h3>${t.ppfd_calibration}</h3>
    <p class="muted">${t.ppfd_hint}</p>
    <div class="fields">
      ${numberField(c, "ppfd_at_full", t.ppfd_at_full)}
      ${numberField(c, "ppfd_ref_distance", t.ppfd_ref_distance)}
      ${numberField(c, "light_distance", t.light_distance)}
      ${numberField(c, "ppfd_manual", t.ppfd_manual)}
    </div>
  </div>`;
}

function phaseCard(c: Ctx): Tpl {
  const t = c.t;
  const due = c.state("flower_switch_due")?.state === "on";
  return html`<div class="card">
    <h2>${t.settings_phase}</h2>
    ${selectApply(c, "phase_select", t.phase, t.phases, t.confirm_phase)}
    <div class="actions">${pressButton(c, "advance_phase", t.advance_phase, t.confirm_advance)}</div>
    <h3>${t.flower_switch}</h3>
    ${due ? html`<div class="alert info">${t.flower_switch_due}</div>` : nothing}
    <div class="actions">
      ${pressButton(c, "confirm_flower", t.confirm_flower, t.confirm_flower_q)}
      ${pressButton(c, "postpone_flower", t.postpone_flower)}
    </div>
    <div class="fields">${numberField(c, "flower_postpone_days", t.postpone_days)}</div>
  </div>`;
}

function calibrationCard(c: Ctx): Tpl {
  const t = c.t;
  const hasReservoir = !!c.grow.sources?.sensor_reservoir;
  const hasWeight = !!c.grow.sources?.sensor_weight;
  return html`<div class="card">
    <h2>${t.settings_calibration}</h2>
    ${hasReservoir ? html`
      <h3>${t.cal_reservoir}</h3>
      <p class="muted">${t.cal_res_hint}</p>
      <div class="kv">
        <span>${t.measured_now}</span><b>${sourceValue(c, "sensor_reservoir")}</b>
        <span>${t.stored} ${t.res_empty}</span><b>${stored(c, "res_dist_empty", "mm")}</b>
        <span>${t.stored} ${t.res_full}</span><b>${stored(c, "res_dist_full", "mm")}</b>
      </div>
      <div class="actions">
        ${pressButton(c, "cal_res_empty", t.res_empty, `${t.res_empty}: ${sourceValue(c, "sensor_reservoir")}?`)}
        ${pressButton(c, "cal_res_full", t.res_full, `${t.res_full}: ${sourceValue(c, "sensor_reservoir")}?`)}
      </div>` : nothing}
    ${hasWeight ? html`
      <h3>${t.cal_pot}</h3>
      <p class="muted">${t.cal_pot_hint}</p>
      <div class="kv">
        <span>${t.measured_now}</span><b>${sourceValue(c, "sensor_weight")}</b>
        <span>${t.stored} ${t.cal_fc}</span><b>${stored(c, "field_capacity", "g")}</b>
        <span>${t.stored} ${t.cal_dry}</span><b>${stored(c, "dry_weight", "g")}</b>
      </div>
      <div class="actions">
        ${pressButton(c, "cal_fc", t.cal_fc, `${t.cal_fc}: ${sourceValue(c, "sensor_weight")}?`)}
        ${pressButton(c, "cal_dry", t.cal_dry, `${t.cal_dry}: ${sourceValue(c, "sensor_weight")}?`)}
        ${pressButton(c, "reset_dryback", t.reset_dryback, `${t.reset_dryback}?`)}
      </div>` : nothing}
    <div class="fields">${numberField(c, "leaf_offset", t.leaf_offset, { hint: t.leaf_hint })}</div>
  </div>`;
}

function safetyCard(c: Ctx): Tpl {
  const t = c.t;
  return html`<div class="card">
    <h2>${t.settings_safety}</h2>
    <p class="muted">${t.safety_hint}</p>
    <div class="fields">
      ${numberField(c, "max_shot_seconds", t.max_shot_seconds)}
      ${numberField(c, "max_shots_per_day", t.max_shots_per_day)}
      ${numberField(c, "max_daily_runtime_min", t.max_daily_runtime)}
      ${numberField(c, "max_saturation_pct", t.max_saturation)}
    </div>
  </div>`;
}

function growCard(c: Ctx): Tpl {
  const t = c.t;
  return html`<div class="card">
    <h2>${t.settings_grow}</h2>
    <div class="fields">
      ${numberField(c, "container_size_ml", t.container_size)}
      ${numberField(c, "tank_volume_l", t.tank_volume)}
      ${numberField(c, "power_price", t.power_price)}
    </div>
  </div>`;
}

function toolsCard(c: Ctx): Tpl {
  const t = c.t;
  const hasPump = !!c.grow.sources?.device_pump;
  const test = c.state("test_status");
  return html`<div class="card">
    <h2>${t.settings_tools}</h2>
    ${test && test.state !== "unknown" ? html`<div class="kv">
      <span>${t.test_result}</span><b>${test.state}</b></div>` : nothing}
    <div class="actions">
      ${pressButton(c, "test_setup", t.test_setup, t.confirm_test_setup)}
      ${pressButton(c, "test_pump", t.test_pump, t.confirm_test_pump, !hasPump)}
      ${hasPump ? nothing : html`<span class="muted">${t.no_pump}</span>`}
    </div>
    <div class="actions">
      ${pressButton(c, "export_csv", t.export_csv)}
      ${pressButton(c, "mute_alerts", t.mute_alerts)}
      ${pressButton(c, "archive_grow", t.archive_grow, t.confirm_archive)}
    </div>
  </div>`;
}

export function settingsTab(c: Ctx): Tpl {
  return html`${lightCard(c)}${phaseCard(c)}${calibrationCard(c)}${safetyCard(c)}${growCard(c)}${toolsCard(c)}`;
}
