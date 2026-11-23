import { html, nothing } from "lit";
import { fill } from "../i18n";
import { formValues, type Ctx, type Tpl } from "../ctx";
import { onSubmit } from "./common";

const DAY_MS = 86400 * 1000;
const PHASE_COLORS: Record<string, string> = {
  clone: "#90caf9", veg: "#81c784", stretch: "#fff176", bulk: "#ffb74d", ripen: "#e57373", drying: "#a1887f",
};

function dayStart(iso: string): number {
  return new Date(`${iso}T00:00:00`).getTime();
}

function timeline(c: Ctx): Tpl {
  const segs = c.grow.phase_timeline ?? [];
  if (!segs.length) return nothing;
  const startIso = c.grow.start_date && c.grow.start_date < segs[0].date ? c.grow.start_date : segs[0].date;
  const t0 = dayStart(startIso);
  const tEnd = Math.max(Date.now(), t0 + DAY_MS);
  const total = tEnd - t0;
  // Gap between grow start and the first known phase (older grows): unknown.
  const parts: { phase: string | null; from: number; to: number }[] = [];
  if (dayStart(segs[0].date) > t0) parts.push({ phase: null, from: t0, to: dayStart(segs[0].date) });
  segs.forEach((s, i) => {
    const to = i + 1 < segs.length ? dayStart(segs[i + 1].date) : tEnd;
    parts.push({ phase: s.phase, from: dayStart(s.date), to });
  });
  const days = (ms: number) => Math.max(1, Math.round(ms / DAY_MS));
  return html`
    <div class="timeline">
      ${parts.map((p) => html`<div class="seg" title=${p.phase ? c.t.phases[p.phase] ?? p.phase : "?"}
        style="flex:${(p.to - p.from) / total};background:${p.phase ? PHASE_COLORS[p.phase] ?? "#bdbdbd" : "var(--divider-color)"}"></div>`)}
    </div>
    <ul class="list">
      ${parts.filter((p) => p.phase).map((p) => html`<li>
        <span class="swatch" style="background:${PHASE_COLORS[p.phase!] ?? "#bdbdbd"}"></span>
        <span class="grow">${c.t.phases[p.phase!] ?? p.phase}</span>
        <span>${c.t.since} ${c.date(new Date(p.from).toISOString())}</span>
        <span>${days(p.to - p.from)} d</span></li>`)}
    </ul>`;
}

function nextEvent(c: Ctx): Tpl {
  const st = c.state("next_training_event");
  if (!st || st.state === "unknown" || st.state === "unavailable") return nothing;
  const n = st.attributes.in_days;
  const when = n == null ? "" : n <= 0 ? c.t.today : fill(c.t.in_days, { n });
  return c.tile("next_training_event", c.t.next_event, { value: c.t.training[st.state] ?? st.state, sub: when });
}

interface DiaryEntry {
  date: string;
  comment?: string;
  thumb?: string | null;
  snapshot?: Record<string, number | string | null>;
}

function snapshotLine(c: Ctx, s: DiaryEntry["snapshot"]): string {
  if (!s) return "";
  const parts: string[] = [];
  if (s.phase) parts.push(c.t.phases[s.phase as string] ?? String(s.phase));
  if (s.day_total != null) parts.push(`${c.t.day} ${s.day_total}`);
  if (typeof s.temp === "number") parts.push(`${c.number(s.temp, 1)} °C`);
  if (typeof s.humidity === "number") parts.push(`${c.number(s.humidity, 0)} %`);
  if (typeof s.vpd === "number") parts.push(`VPD ${c.number(s.vpd, 2)}`);
  if (typeof s.dryback_pct === "number") parts.push(`${c.t.dryback} ${c.number(s.dryback_pct, 1)} %`);
  return parts.join(" · ");
}

function diaryList(c: Ctx): Tpl {
  const entries = (c.state("diary_count")?.attributes.entries ?? []) as DiaryEntry[];
  if (!entries.length) return html`<p class="muted">${c.t.no_entries}</p>`;
  return html`<div class="diary">
    ${entries.map((e) => html`<div class="entry">
      ${e.thumb ? html`<img src=${e.thumb} alt="" loading="lazy">` : html`<div class="noimg"></div>`}
      <div>
        <div class="edate">${c.date(e.date)}</div>
        ${e.comment ? html`<div>${e.comment}</div>` : nothing}
        <div class="muted small">${snapshotLine(c, e.snapshot)}</div>
      </div>
    </div>`)}
  </div>`;
}

export function growLogTab(c: Ctx): Tpl {
  const t = c.t;
  const submit = onSubmit(async (form) => {
    const v = formValues(form);
    if (!v.comment && !v.image) return false;
    return c.service("add_diary_entry", { comment: v.comment ?? "", image: v.image ?? "" });
  });
  return html`
    <div class="card">
      <h2>${t.phase_timeline}</h2>
      ${timeline(c)}
      <div class="tiles" style="margin-top:12px">
        ${nextEvent(c)}
        ${c.tile("flower_day", c.t.flower_day, { decimals: 0 })}
      </div>
    </div>

    <div class="card">
      <h2>${t.diary_today}</h2>
      <form @submit=${submit}>
        <label class="wide">${t.comment}<textarea name="comment" rows="3" maxlength="1000"></textarea></label>
        <label class="wide">${t.image}<input name="image" maxlength="500" placeholder="/media/..."></label>
        <button type="submit">${t.save}</button>
      </form>
    </div>

    <div class="card wide">
      <h2>${t.diary}</h2>
      ${diaryList(c)}
    </div>`;
}
