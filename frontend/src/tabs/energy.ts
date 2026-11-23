import { html, nothing } from "lit";
import type { Series } from "../chart";
import { formValues, toNumber, type Ctx, type Tpl } from "../ctx";
import { COLORS, chartRange, onSubmit } from "./common";

export const ENERGY_HISTORY = { keys: ["energy_cost_eur"], hours: 24 * 30 };

function perDevice(c: Ctx): Tpl {
  const attrs = c.state("energy_total_kwh")?.attributes ?? {};
  const rows = Object.entries(attrs)
    .filter(([k, v]) => k.includes(".") && typeof v === "number")
    .map(([id, kwh]) => ({
      id,
      name: c.hass.states[id]?.attributes.friendly_name ?? id,
      kwh: kwh as number,
    }))
    .sort((a, b) => b.kwh - a.kwh);
  if (!rows.length) return html`<p class="muted">${c.t.no_data}</p>`;
  const max = rows[0].kwh || 1;
  return html`<div class="bars">
    ${rows.map((r) => html`
      <button class="bar" @click=${() => c.moreInfo(r.id)}>
        <span class="bname">${r.name}</span>
        <span class="btrack"><span style="width:${(r.kwh / max) * 100}%"></span></span>
        <span class="bval">${c.number(r.kwh, 2)} kWh</span>
      </button>`)}
  </div>`;
}

function recentCosts(c: Ctx): Tpl {
  const entries = (c.state("extra_costs_total")?.attributes.entries ?? []) as
    { date: string; amount: number; note?: string }[];
  if (!entries.length) return nothing;
  return html`<h3>${c.t.recent_costs}</h3>
    <ul class="list">
      ${[...entries].reverse().slice(0, 8).map((e) => html`
        <li><span>${c.date(e.date)}</span><span class="grow">${e.note || "–"}</span>
          <span>${c.number(e.amount, 2)} €</span></li>`)}
    </ul>`;
}

function harvestInfo(c: Ctx): Tpl {
  const h = c.state("cost_per_gram")?.attributes ?? {};
  if (h.dry_g == null) return nothing;
  return html`<div class="tiles">
    <div class="tile static"><span class="tlabel">${c.t.wet_g}</span><span class="tval">${c.number(h.wet_g, 0)} g</span></div>
    <div class="tile static"><span class="tlabel">${c.t.dry_g}</span><span class="tval">${c.number(h.dry_g, 0)} g</span></div>
    ${h.drying_loss_pct != null ? html`<div class="tile static"><span class="tlabel">${c.t.drying_loss}</span>
      <span class="tval">${c.number(h.drying_loss_pct, 1)} %</span></div>` : nothing}
  </div>`;
}

export function energyTab(c: Ctx): Tpl {
  const t = c.t;
  const cost: Series[] = [
    { label: t.cost_total, unit: "€", color: COLORS.cost, points: c.points("energy_cost_eur"), decimals: 2 },
  ];
  const [start, end] = chartRange(cost, ENERGY_HISTORY.hours);
  const submitCost = onSubmit(async (form) => {
    const v = formValues(form);
    const amount = toNumber(v.amount);
    if (amount === undefined) return false;
    return c.service("add_extra_cost", { amount, note: v.note ?? "" });
  });
  const submitHarvest = onSubmit(async (form) => {
    const v = formValues(form);
    const wet = toNumber(v.wet_g);
    const dry = toNumber(v.dry_g);
    if (wet === undefined || dry === undefined) return false;
    return c.service("set_harvest", { wet_g: wet, dry_g: dry, extra_cost: toNumber(v.extra_cost) ?? 0 });
  });

  return html`
    <div class="card">
      <h2>${t.tabs.energy}</h2>
      <div class="tiles">
        ${c.tile("daily_cost_eur", t.cost_today, { decimals: 2 })}
        ${c.tile("energy_cost_eur", t.cost_total, { decimals: 2 })}
        ${c.tile("energy_total_kwh", t.kwh_total, { decimals: 1 })}
        ${c.tile("extra_costs_total", t.extras, { decimals: 2 })}
        ${c.tile("cost_per_gram", t.cost_per_gram, { decimals: 2 })}
      </div>
      <h3>${t.chart_cost}</h3>
      <pg-chart .series=${cost} .start=${start} .end=${end} .lang=${c.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.kwh_per_device}</h2>
      ${perDevice(c)}
    </div>

    <div class="card">
      <h2>${t.log_cost}</h2>
      <form @submit=${submitCost}>
        <label>${t.amount}<input name="amount" inputmode="decimal" required pattern="-?[0-9]+([.,][0-9]+)?"></label>
        <label class="wide">${t.note}<input name="note" maxlength="200"></label>
        <button type="submit">${t.save}</button>
      </form>
      ${recentCosts(c)}
    </div>

    <div class="card">
      <h2>${t.harvest}</h2>
      ${harvestInfo(c)}
      <form @submit=${submitHarvest}>
        <label>${t.wet_g}<input name="wet_g" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.dry_g}<input name="dry_g" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.extra_cost}<input name="extra_cost" inputmode="decimal" pattern="[0-9]+([.,][0-9]+)?"></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>`;
}
