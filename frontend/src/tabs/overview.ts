import { html, nothing } from "lit";
import type { Series } from "../chart";
import type { Ctx, Status, Tpl } from "../ctx";
import { COLORS, chartRange } from "./common";

export const OVERVIEW_HISTORY = { keys: ["temperature", "humidity", "vpd", "weight", "dryback_pct"], hours: 24 };

function reservoirStatus(c: Ctx): Status {
  const s = c.status("reservoir_status");
  if (s === "critical") return "critical";
  if (s === "low" || s === "warning") return "warning";
  return undefined;
}

function irrigationSwitch(c: Ctx): Tpl {
  const id = c.grow.entities["irrigation_enabled"];
  const st = id ? c.hass.states[id] : undefined;
  if (!id || !st) return nothing;
  const locked = c.state("irrigation_locked")?.state === "on";
  return html`<div class="row">
    <span>${c.t.irrigation_enabled}</span>
    ${locked ? html`<span class="badge critical">${c.t.irrigation_locked}</span>` : nothing}
    <ha-switch .checked=${st.state === "on"}
      @change=${() => c.hass.callService("switch", "toggle", { entity_id: id })}></ha-switch>
  </div>`;
}

export function overviewTab(c: Ctx): Tpl {
  const t = c.t;
  const tg = c.grow.targets;
  const climate: Series[] = [
    { label: t.temperature, unit: "°C", color: COLORS.temp, points: c.points("temperature"), band: c.band("temp_day") },
    { label: t.humidity, unit: "%", color: COLORS.rh, points: c.points("humidity"), band: c.band("rh"), decimals: 0 },
    { label: t.vpd, unit: "kPa", color: COLORS.vpd, points: c.points("vpd"), band: c.band("vpd"), decimals: 2 },
  ];
  const pot: Series[] = [
    { label: t.weight, unit: "g", color: COLORS.weight, points: c.points("weight"), decimals: 0 },
    { label: t.dryback, unit: "%", color: COLORS.dryback, points: c.points("dryback_pct"), band: c.band("dryback_p3") },
  ];
  const [start, end] = chartRange([...climate, ...pot], OVERVIEW_HISTORY.hours);
  const elapsed = c.num("light_elapsed_pct");

  return html`
    <div class="card">
      <h2>${t.climate}</h2>
      <div class="tiles">
        ${c.tile("temperature", t.temperature, { sub: c.range(tg.temp_day, "°C") })}
        ${c.tile("humidity", t.humidity, { decimals: 0, sub: c.range(tg.rh, "%") })}
        ${c.tile("vpd", t.vpd, { decimals: 2, sub: c.range(tg.vpd, "kPa"), status: c.status("vpd_status") })}
        ${c.tile("lvpd", t.lvpd, { decimals: 2 })}
      </div>
      <h3>${t.chart_climate}</h3>
      <pg-chart .series=${climate} .start=${start} .end=${end} .lang=${c.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.light}</h2>
      <div class="tiles">
        ${c.tile("brightness_pct", t.brightness, {
          decimals: 0,
          sub: c.grow.brightness_target != null ? `${t.target} ${c.grow.brightness_target} %` : "",
        })}
        ${c.tile("dli", t.dli, { sub: c.range(c.grow.dli_target, "mol/m²/d"), status: c.status("dli_status") })}
        ${c.tile("light_remaining", t.remaining, { decimals: 1 })}
      </div>
      ${elapsed !== null ? html`<div class="progress"><div style="width:${Math.min(100, elapsed)}%"></div></div>` : nothing}
    </div>

    <div class="card">
      <h2>${t.irrigation}</h2>
      <div class="tiles">
        ${c.tile("weight", t.weight, { decimals: 0 })}
        ${c.tile("dryback_pct", t.dryback, { sub: c.range(tg.dryback_p3, "%"), status: c.status("dryback_status") })}
        ${c.tile("p_phase", t.p_phase)}
        ${c.tile("irrigation_shots_today", t.shots_today, { decimals: 0 })}
      </div>
      ${irrigationSwitch(c)}
      <h3>${t.chart_dryback}</h3>
      <pg-chart .series=${pot} .start=${start} .end=${end} .lang=${c.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.reservoir}</h2>
      <div class="tiles">
        ${c.tile("reservoir_pct", t.level, { decimals: 0, status: reservoirStatus(c) })}
        ${c.tile("reservoir_liters", t.liters, { decimals: 1 })}
        ${c.tile("water_temp", t.water_temp)}
      </div>
    </div>`;
}
