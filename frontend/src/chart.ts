// Small-multiples line chart: one lane per series, shared time axis,
// optional target band, hover line across all lanes. Plain SVG, no library.

import { LitElement, css, html, svg, nothing } from "lit";

export interface Series {
  label: string;
  unit: string;
  color: string;
  points: [number, number][]; // [epoch ms, value]
  band?: [number, number] | null;
  decimals?: number;
}

const W = 600; // viewBox width; scales with the card
const LANE_H = 56;
const PAD_L = 4;
const PAD_R = 4;

export class PgChart extends LitElement {
  static properties = {
    series: { attribute: false },
    start: { type: Number },
    end: { type: Number },
    noData: { type: String, attribute: "no-data" },
    lang: { type: String },
    _hover: { state: true },
  };

  series: Series[] = [];
  start = 0;
  end = 0;
  noData = "No data";
  lang = "en";
  private _hover: number | null = null;

  private _x(t: number): number {
    const span = Math.max(1, this.end - this.start);
    return PAD_L + ((t - this.start) / span) * (W - PAD_L - PAD_R);
  }

  private _range(s: Series): [number, number] {
    let lo = Infinity;
    let hi = -Infinity;
    for (const [, v] of s.points) {
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    if (s.band) {
      lo = Math.min(lo, s.band[0]);
      hi = Math.max(hi, s.band[1]);
    }
    if (!isFinite(lo)) return [0, 1];
    if (hi - lo < 1e-6) return [lo - 1, hi + 1];
    const pad = (hi - lo) * 0.08;
    return [lo - pad, hi + pad];
  }

  private _valueAt(s: Series, t: number): number | null {
    // step interpolation: last known value at or before t
    let val: number | null = null;
    for (const [pt, v] of s.points) {
      if (pt > t) break;
      val = v;
    }
    return val;
  }

  private _onMove(ev: PointerEvent) {
    const rect = (ev.currentTarget as SVGElement).getBoundingClientRect();
    const frac = (ev.clientX - rect.left) / rect.width;
    this._hover = this.start + Math.min(1, Math.max(0, frac)) * (this.end - this.start);
  }

  private _lane(s: Series, i: number) {
    const [lo, hi] = this._range(s);
    const y = (v: number) => LANE_H - 4 - ((v - lo) / (hi - lo)) * (LANE_H - 8);
    const top = i * LANE_H;
    let d = "";
    s.points.forEach(([t, v], idx) => {
      const px = this._x(t).toFixed(1);
      const py = (top + y(v)).toFixed(1);
      if (idx === 0) {
        d += `M${px},${py}`;
      } else {
        // step line: horizontal to the new timestamp, then vertical
        const prevY = (top + y(s.points[idx - 1][1])).toFixed(1);
        d += `L${px},${prevY}L${px},${py}`;
      }
    });
    if (s.points.length) {
      d += `L${this._x(this.end).toFixed(1)},${(top + y(s.points[s.points.length - 1][1])).toFixed(1)}`;
    }
    const band = s.band
      ? svg`<rect class="band" x=${PAD_L} width=${W - PAD_L - PAD_R}
          y=${top + y(s.band[1])} height=${Math.max(0, y(s.band[0]) - y(s.band[1]))}></rect>`
      : nothing;
    return svg`
      <line class="sep" x1="0" x2=${W} y1=${top + LANE_H} y2=${top + LANE_H}></line>
      ${band}
      <path d=${d} stroke=${s.color} class="line"></path>`;
  }

  render() {
    const lanes = this.series.filter((s) => s.points.length);
    if (!lanes.length) return html`<div class="empty">${this.noData}</div>`;
    const h = lanes.length * LANE_H;
    const hx = this._hover !== null ? this._x(this._hover) : null;
    const dec = (s: Series) => s.decimals ?? 1;
    return html`
      <div class="wrap">
        <div class="labels">
          ${lanes.map((s) => {
            const v = this._hover !== null
              ? this._valueAt(s, this._hover)
              : s.points[s.points.length - 1][1];
            return html`<div class="label" style="height:${LANE_H}px">
              <span class="dot" style="background:${s.color}"></span>
              <span class="name">${s.label}</span>
              <span class="val">${v === null ? "–" : v.toLocaleString(this.lang, { minimumFractionDigits: dec(s), maximumFractionDigits: dec(s) })} ${s.unit}</span>
            </div>`;
          })}
        </div>
        <svg viewBox="0 0 ${W} ${h}" preserveAspectRatio="none" style="height:${h}px"
          @pointermove=${this._onMove} @pointerleave=${() => (this._hover = null)}>
          ${lanes.map((s, i) => this._lane(s, i))}
          ${hx !== null ? svg`<line class="hover" x1=${hx} x2=${hx} y1="0" y2=${h}></line>` : nothing}
        </svg>
      </div>
      <div class="axis">
        <span>${this._time(this.start)}</span>
        <span>${this._hover !== null ? this._time(this._hover) : ""}</span>
        <span>${this._time(this.end)}</span>
      </div>`;
  }

  private _time(t: number): string {
    return new Date(t).toLocaleTimeString(this.lang, { hour: "2-digit", minute: "2-digit" });
  }

  static styles = css`
    .wrap { display: flex; gap: 8px; }
    .labels { flex: 0 0 auto; min-width: 120px; }
    .label { display: flex; flex-direction: column; justify-content: center; font-size: 12px;
      color: var(--secondary-text-color); position: relative; padding-left: 12px; }
    .label .val { font-size: 15px; color: var(--primary-text-color); font-variant-numeric: tabular-nums; }
    .dot { position: absolute; left: 0; top: 50%; width: 6px; height: 6px; border-radius: 50%;
      transform: translateY(-50%); }
    svg { flex: 1 1 auto; width: 100%; touch-action: none; display: block; }
    .line { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; }
    .band { fill: var(--success-color, #43a047); opacity: 0.12; }
    .sep { stroke: var(--divider-color); stroke-width: 1; vector-effect: non-scaling-stroke; }
    .hover { stroke: var(--secondary-text-color); stroke-width: 1; stroke-dasharray: 3 3;
      vector-effect: non-scaling-stroke; }
    .axis { display: flex; justify-content: space-between; font-size: 11px;
      color: var(--secondary-text-color); padding-left: 128px; margin-top: 2px; }
    .empty { color: var(--secondary-text-color); font-size: 13px; padding: 16px 0; }
  `;
}

if (!customElements.get("pg-chart")) customElements.define("pg-chart", PgChart);
