import { html, nothing } from "lit";
import type { Series } from "../chart";
import { formValues, toNumber, type Ctx, type Status, type Tpl } from "../ctx";
import { COLORS, chartRange, onSubmit } from "./common";

export const NUTRIENTS_HISTORY = { keys: ["ec", "ph"], hours: 24 * 7 };

const REC_STATUS: Record<string, Status> = {
  keep_ec: "optimal", increase_ec: "warning", reduce_ec: "warning", flush: "critical", check_roots: "critical",
};

function lastRunoff(c: Ctx): Tpl {
  const t = c.t;
  const st = c.state("nutrient_recommendation");
  const a = st?.attributes ?? {};
  if (!st || a.runoff_ec == null) {
    return html`<p class="muted">${t.no_data}</p>`;
  }
  const rec = st.state;
  return html`
    <div class="tiles">
      ${c.tile("nutrient_recommendation", t.recommendation, {
        value: t.recommendations[rec] ?? rec, status: REC_STATUS[rec], sub: c.date(a.ts),
      })}
      <div class="tile static"><span class="tlabel">${t.runoff_ec}</span>
        <span class="tval">${c.number(a.runoff_ec, 2)}</span>
        <span class="tsub">${t.target_ec} ${c.number(a.target_ec, 2)}</span></div>
      <div class="tile static"><span class="tlabel">${t.runoff_ph}</span>
        <span class="tval">${c.number(a.runoff_ph, 2)}</span>
        <span class="tsub">${t.trend}: ${t.trends[a.ph_trend] ?? a.ph_trend ?? "–"}</span></div>
      <div class="tile static"><span class="tlabel">${t.ec_vs_feed}</span>
        <span class="tval small">${t.trends[a.ec_trend] ?? a.ec_trend ?? "–"}</span></div>
    </div>
    ${a.note ? html`<p class="muted">${t.note}: ${a.note}</p>` : nothing}`;
}

export function nutrientsTab(c: Ctx): Tpl {
  const t = c.t;
  const feed: Series[] = [
    { label: t.ec, unit: "mS/cm", color: COLORS.ec, points: c.points("ec"), decimals: 2 },
    { label: t.ph, unit: "", color: COLORS.ph, points: c.points("ph"), decimals: 2 },
  ];
  const [start, end] = chartRange(feed, NUTRIENTS_HISTORY.hours);
  const submit = onSubmit(async (form) => {
    const v = formValues(form);
    const ec = toNumber(v.runoff_ec);
    const ph = toNumber(v.runoff_ph);
    if (ec === undefined || ph === undefined) return false;
    const data: Record<string, unknown> = { runoff_ec: ec, runoff_ph: ph, note: v.note ?? "" };
    const vol = toNumber(v.volume_ml);
    const ppm = toNumber(v.ppm);
    if (vol !== undefined) data.volume_ml = vol;
    if (ppm !== undefined) data.ppm = ppm;
    return c.service("log_runoff", data);
  });

  return html`
    <div class="card">
      <h2>${t.feed}</h2>
      <div class="tiles">
        ${c.tile("ec", t.ec, { decimals: 2 })}
        ${c.tile("ph", t.ph, { decimals: 2 })}
      </div>
      <h3>${t.chart_feed}</h3>
      <pg-chart .series=${feed} .start=${start} .end=${end} .lang=${c.lang} no-data=${t.no_data}></pg-chart>
    </div>

    <div class="card">
      <h2>${t.last_runoff}</h2>
      ${lastRunoff(c)}
    </div>

    <div class="card">
      <h2>${t.log_runoff}</h2>
      <form @submit=${submit}>
        <label>${t.runoff_ec}<input name="runoff_ec" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.runoff_ph}<input name="runoff_ph" inputmode="decimal" required pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.volume_ml}<input name="volume_ml" inputmode="decimal" pattern="[0-9]+([.,][0-9]+)?"></label>
        <label>${t.ppm}<input name="ppm" inputmode="decimal" pattern="[0-9]+([.,][0-9]+)?"></label>
        <label class="wide">${t.note}<input name="note" maxlength="200"></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>`;
}
