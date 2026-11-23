// Precision Grow sidebar panel (overview of one grow).

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import "./chart";
import type { Series } from "./chart";
import { strings, type Strings } from "./i18n";
import type { Grow, History, HomeAssistant } from "./types";

const REFRESH_MS = 5 * 60 * 1000;
const HISTORY_HOURS = 24;
const STORAGE_KEY = "precision_grow_panel_grow";

const COLORS = {
  temp: "var(--pg-temp, #e57373)",
  rh: "var(--pg-rh, #4fc3f7)",
  vpd: "var(--pg-vpd, #81c784)",
  weight: "var(--pg-weight, #ba68c8)",
  dryback: "var(--pg-dryback, #ffb74d)",
};

type Status = "optimal" | "high" | "low" | "warning" | "critical" | "ok" | undefined;

class PrecisionGrowPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _grows: { state: true },
    _selected: { state: true },
    _error: { state: true },
    _history: { state: true },
    _historyRange: { state: true },
  };

  hass!: HomeAssistant;
  narrow = false;
  private _grows: Grow[] | null = null;
  private _selected: string | null = localStorage.getItem(STORAGE_KEY);
  private _error: string | null = null;
  private _history: History = {};
  private _historyRange: [number, number] = [0, 0];
  private _timer?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this._timer = window.setInterval(() => this._refresh(), REFRESH_MS);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) window.clearInterval(this._timer);
  }

  protected firstUpdated(): void {
    this._refresh();
  }

  private get _t(): Strings {
    return strings(this.hass?.locale?.language ?? this.hass?.language);
  }

  private get _grow(): Grow | undefined {
    if (!this._grows?.length) return undefined;
    return this._grows.find((g) => g.entry_id === this._selected) ?? this._grows[0];
  }

  private async _refresh(): Promise<void> {
    if (!this.hass) return;
    try {
      const res = await this.hass.callWS<{ grows: Grow[] }>({ type: "precision_grow/grows" });
      this._grows = res.grows;
      this._error = null;
    } catch (err: any) {
      this._error = `${this._t.error}: ${err?.message ?? err}`;
      return;
    }
    await this._loadHistory();
  }

  private async _loadHistory(): Promise<void> {
    const grow = this._grow;
    if (!grow) return;
    const ids = ["temperature", "humidity", "vpd", "weight", "dryback_pct"]
      .map((k) => grow.entities[k])
      .filter(Boolean);
    if (!ids.length) return;
    const end = Date.now();
    const start = end - HISTORY_HOURS * 3600 * 1000;
    try {
      this._history = await this.hass.callWS<History>({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        entity_ids: ids,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      this._historyRange = [start, end];
    } catch {
      // history integration missing or recorder disabled: charts stay empty
      this._history = {};
    }
  }

  private _select(ev: Event): void {
    this._selected = (ev.target as HTMLSelectElement).value;
    localStorage.setItem(STORAGE_KEY, this._selected);
    this._loadHistory();
  }

  // --- helpers -------------------------------------------------------------

  private _state(key: string) {
    const id = this._grow?.entities[key];
    return id ? this.hass.states[id] : undefined;
  }

  private _num(key: string): number | null {
    const st = this._state(key);
    if (!st) return null;
    const v = parseFloat(st.state);
    return isFinite(v) ? v : null;
  }

  private _fmt(key: string, decimals = 1): string {
    const st = this._state(key);
    if (!st || st.state === "unknown" || st.state === "unavailable") return "–";
    const v = parseFloat(st.state);
    const unit = st.attributes.unit_of_measurement ?? "";
    if (!isFinite(v)) return st.state;
    const lang = this.hass.locale?.language ?? this.hass.language;
    const n = v.toLocaleString(lang, { maximumFractionDigits: decimals });
    return unit ? `${n} ${unit}` : n;
  }

  private _status(key: string): Status {
    return this._state(key)?.state as Status;
  }

  private _range(r: unknown, unit: string): string {
    if (!Array.isArray(r) || r[0] == null || r[1] == null) return "";
    return `${this._t.target} ${r[0]}–${r[1]} ${unit}`;
  }

  private _moreInfo(key: string): void {
    const entityId = this._grow?.entities[key];
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
    );
  }

  private _points(key: string): [number, number][] {
    const id = this._grow?.entities[key];
    const raw = id ? this._history[id] : undefined;
    if (!raw) return [];
    const out: [number, number][] = [];
    for (const p of raw) {
      const v = parseFloat(p.s);
      if (isFinite(v)) out.push([p.lu * 1000, v]);
    }
    // History is refreshed every 5 min; extend it with the live state.
    const live = this._num(key);
    if (out.length && live !== null) out.push([Date.now(), live]);
    return out;
  }

  private _band(key: string): [number, number] | null {
    const r = this._grow?.targets[key];
    return Array.isArray(r) ? [r[0], r[1]] : null;
  }

  // --- render --------------------------------------------------------------

  private _tile(key: string, label: string, opts: {
    decimals?: number; sub?: string; status?: Status;
  } = {}): TemplateResult | typeof nothing {
    if (!this._grow?.entities[key]) return nothing;
    return html`
      <button class="tile ${opts.status ?? ""}" @click=${() => this._moreInfo(key)}>
        <span class="tlabel">${label}</span>
        <span class="tval">${this._fmt(key, opts.decimals)}</span>
        ${opts.sub ? html`<span class="tsub">${opts.sub}</span>` : nothing}
      </button>`;
  }

  private _header(grow: Grow | undefined): TemplateResult {
    const t = this._t;
    return html`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Precision Grow</div>
        ${this._grows && this._grows.length > 1
          ? html`<select @change=${this._select} .value=${grow?.entry_id ?? ""}>
              ${this._grows.map((g) => html`<option value=${g.entry_id}
                ?selected=${g.entry_id === grow?.entry_id}>${g.title}</option>`)}
            </select>`
          : grow ? html`<div class="growname">${grow.title}</div>` : nothing}
      </div>
      ${grow ? html`
        <div class="summary">
          <span class="phase">${t.phases[grow.phase] ?? grow.phase}</span>
          ${this._num("day_total") !== null ? html`<span>${t.day} ${this._num("day_total")}</span>` : nothing}
          ${this._num("day_in_phase") !== null ? html`<span>${this._num("day_in_phase")}. ${t.day_in_phase}</span>` : nothing}
          ${this._alertChip()}
        </div>` : nothing}`;
  }

  private _alertChip(): TemplateResult | typeof nothing {
    const st = this._state("alert_level");
    if (!st) return nothing;
    const count = st.attributes.count ?? 0;
    return html`<button class="chip ${st.state}" @click=${() => this._moreInfo("alert_level")}>
      ${count ? `${this._t.alerts}: ${count}` : this._t.no_alerts}</button>`;
  }

  private _alerts(): TemplateResult | typeof nothing {
    const items = this._state("alert_level")?.attributes.items as
      | { severity: string; message: string }[] | undefined;
    if (!items?.length) return nothing;
    return html`<div class="card alerts">
      <h2>${this._t.alerts}</h2>
      ${items.map((a) => html`<div class="alert ${a.severity}">${a.message}</div>`)}
    </div>`;
  }

  private _irrigationSwitch(): TemplateResult | typeof nothing {
    const id = this._grow?.entities["irrigation_enabled"];
    const st = id ? this.hass.states[id] : undefined;
    if (!id || !st) return nothing;
    const locked = this._state("irrigation_locked")?.state === "on";
    return html`<div class="row">
      <span>${this._t.irrigation_enabled}</span>
      ${locked ? html`<span class="badge critical">${this._t.irrigation_locked}</span>` : nothing}
      <ha-switch .checked=${st.state === "on"}
        @change=${() => this.hass.callService("switch", "toggle", { entity_id: id })}></ha-switch>
    </div>`;
  }

  render(): TemplateResult {
    const t = this._t;
    if (this._error) return html`${this._header(undefined)}<div class="msg">${this._error}</div>`;
    if (this._grows === null) return html`${this._header(undefined)}<div class="msg">${t.loading}</div>`;
    const grow = this._grow;
    if (!grow) return html`${this._header(undefined)}<div class="msg">${t.no_grow}</div>`;

    const tg = grow.targets;
    const climate: Series[] = [
      { label: t.temperature, unit: "°C", color: COLORS.temp, points: this._points("temperature"), band: this._band("temp_day") },
      { label: t.humidity, unit: "%", color: COLORS.rh, points: this._points("humidity"), band: this._band("rh"), decimals: 0 },
      { label: t.vpd, unit: "kPa", color: COLORS.vpd, points: this._points("vpd"), band: this._band("vpd"), decimals: 2 },
    ];
    const pot: Series[] = [
      { label: t.weight, unit: "g", color: COLORS.weight, points: this._points("weight"), decimals: 0 },
      { label: t.dryback, unit: "%", color: COLORS.dryback, points: this._points("dryback_pct"), band: this._band("dryback_p3") },
    ];
    const elapsed = this._num("light_elapsed_pct");
    const [rangeStart] = this._historyRange;
    const end = Date.now();
    // Short history (new grow, fresh recorder): start the axis at the first point.
    const first = Math.min(...[...climate, ...pot].map((x) => x.points[0]?.[0] ?? Infinity));
    const start = isFinite(first) ? Math.max(rangeStart, first) : rangeStart;
    const lang = this.hass.locale?.language ?? this.hass.language;

    return html`
      ${this._header(grow)}
      <div class="content">
        ${this._alerts()}

        <div class="card">
          <h2>${t.climate}</h2>
          <div class="tiles">
            ${this._tile("temperature", t.temperature, { sub: this._range(tg.temp_day, "°C") })}
            ${this._tile("humidity", t.humidity, { decimals: 0, sub: this._range(tg.rh, "%") })}
            ${this._tile("vpd", t.vpd, { decimals: 2, sub: this._range(tg.vpd, "kPa"), status: this._status("vpd_status") })}
            ${this._tile("lvpd", t.lvpd, { decimals: 2 })}
          </div>
          <h3>${t.chart_climate}</h3>
          <pg-chart .series=${climate} .start=${start} .end=${end} .lang=${lang} no-data=${t.no_data}></pg-chart>
        </div>

        <div class="card">
          <h2>${t.light}</h2>
          <div class="tiles">
            ${this._tile("brightness_pct", t.brightness, {
              decimals: 0,
              sub: grow.brightness_target != null ? `${t.target} ${grow.brightness_target} %` : "",
            })}
            ${this._tile("dli", t.dli, { sub: this._range(grow.dli_target, "mol/m²/d"), status: this._status("dli_status") })}
            ${this._tile("light_remaining", t.remaining, { decimals: 1 })}
          </div>
          ${elapsed !== null ? html`<div class="progress"><div style="width:${Math.min(100, elapsed)}%"></div></div>` : nothing}
        </div>

        <div class="card">
          <h2>${t.irrigation}</h2>
          <div class="tiles">
            ${this._tile("weight", t.weight, { decimals: 0 })}
            ${this._tile("dryback_pct", t.dryback, { sub: this._range(tg.dryback_p3, "%"), status: this._status("dryback_status") })}
            ${this._tile("p_phase", t.p_phase)}
            ${this._tile("irrigation_shots_today", t.shots_today, { decimals: 0 })}
          </div>
          ${this._irrigationSwitch()}
          <h3>${t.chart_dryback}</h3>
          <pg-chart .series=${pot} .start=${start} .end=${end} .lang=${lang} no-data=${t.no_data}></pg-chart>
        </div>

        <div class="card">
          <h2>${t.reservoir}</h2>
          <div class="tiles">
            ${this._tile("reservoir_pct", t.level, { decimals: 0, status: this._reservoirStatus() })}
            ${this._tile("reservoir_liters", t.liters, { decimals: 1 })}
            ${this._tile("water_temp", t.water_temp)}
          </div>
        </div>
      </div>`;
  }

  private _reservoirStatus(): Status {
    const s = this._status("reservoir_status");
    if (s === "critical") return "critical";
    if (s === "low" || s === "warning") return "warning";
    return undefined;
  }

  static styles = css`
    :host { display: block; background: var(--primary-background-color); min-height: 100vh;
      color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, inherit); }
    .toolbar { display: flex; align-items: center; height: var(--header-height, 56px); padding: 0 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color)); gap: 8px;
      border-bottom: var(--app-header-border-bottom, none); }
    .title { font-size: 20px; flex: 1; }
    .growname { font-size: 14px; opacity: 0.85; }
    select { font: inherit; background: transparent; color: inherit; border: 1px solid currentColor;
      border-radius: 6px; padding: 4px 8px; }
    select option { color: var(--primary-text-color); background: var(--card-background-color); }
    .summary { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 16px 0;
      color: var(--secondary-text-color); font-size: 14px; }
    .phase { color: var(--primary-text-color); font-weight: 500; font-size: 16px; }
    .content { display: grid; gap: 16px; padding: 16px;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); align-items: start; }
    .card { background: var(--card-background-color); border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none); border: 1px solid var(--divider-color);
      padding: 16px; }
    h2 { margin: 0 0 12px; font-size: 16px; font-weight: 500; }
    h3 { margin: 16px 0 6px; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
    .tile { all: unset; cursor: pointer; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px;
      border-radius: 8px; background: var(--secondary-background-color);
      border-left: 3px solid transparent; }
    .tile:focus-visible { outline: 2px solid var(--primary-color); }
    .tile.optimal { border-left-color: var(--success-color, #43a047); }
    .tile.high, .tile.low, .tile.warning { border-left-color: var(--warning-color, #ffa000); }
    .tile.critical { border-left-color: var(--error-color, #db4437); }
    .tlabel { font-size: 12px; color: var(--secondary-text-color); }
    .tval { font-size: 20px; font-variant-numeric: tabular-nums; }
    .tsub { font-size: 11px; color: var(--secondary-text-color); }
    .progress { height: 6px; border-radius: 3px; background: var(--secondary-background-color);
      margin-top: 12px; overflow: hidden; }
    .progress div { height: 100%; background: var(--warning-color, #ffa000); }
    .row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
    .row span:first-child { flex: 1; }
    .badge, .chip { font-size: 12px; padding: 2px 8px; border-radius: 10px;
      background: var(--secondary-background-color); }
    .chip { all: unset; cursor: pointer; font-size: 12px; padding: 2px 10px; border-radius: 10px;
      background: var(--secondary-background-color); color: var(--primary-text-color); }
    .chip.warning, .badge.warning { background: var(--warning-color, #ffa000); color: #000; }
    .chip.critical, .badge.critical { background: var(--error-color, #db4437); color: #fff; }
    .alerts { grid-column: 1 / -1; }
    .alert { padding: 6px 10px; border-radius: 6px; margin-top: 6px; font-size: 14px;
      border-left: 3px solid var(--info-color, #039be5); background: var(--secondary-background-color); }
    .alert.warning { border-left-color: var(--warning-color, #ffa000); }
    .alert.critical { border-left-color: var(--error-color, #db4437); }
    .msg { padding: 24px 16px; color: var(--secondary-text-color); }
  `;
}

if (!customElements.get("precision-grow-panel")) {
  customElements.define("precision-grow-panel", PrecisionGrowPanel);
}
