// Precision Grow sidebar panel: shell with grow selector, summary, alerts and tabs.

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import "./chart";
import { Ctx, type Tpl } from "./ctx";
import { alertText, strings, type Alert, type Strings } from "./i18n";
import { ENERGY_HISTORY, energyTab } from "./tabs/energy";
import { growLogTab } from "./tabs/growlog";
import { NUTRIENTS_HISTORY, nutrientsTab } from "./tabs/nutrients";
import { OVERVIEW_HISTORY, overviewTab } from "./tabs/overview";
import type { Grow, History, HomeAssistant } from "./types";

const REFRESH_MS = 5 * 60 * 1000;
const STORAGE_GROW = "precision_grow_panel_grow";
const STORAGE_TAB = "precision_grow_panel_tab";

type TabId = "overview" | "nutrients" | "energy" | "log";
const TABS: TabId[] = ["overview", "nutrients", "energy", "log"];
const TAB_HISTORY: Record<TabId, { keys: string[]; hours: number } | null> = {
  overview: OVERVIEW_HISTORY,
  nutrients: NUTRIENTS_HISTORY,
  energy: ENERGY_HISTORY,
  log: null,
};

class PrecisionGrowPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _grows: { state: true },
    _selected: { state: true },
    _tab: { state: true },
    _error: { state: true },
    _history: { state: true },
  };

  hass!: HomeAssistant;
  narrow = false;
  private _grows: Grow[] | null = null;
  private _selected: string | null = localStorage.getItem(STORAGE_GROW);
  private _tab: TabId = (TABS as string[]).includes(localStorage.getItem(STORAGE_TAB) ?? "")
    ? (localStorage.getItem(STORAGE_TAB) as TabId)
    : "overview";
  private _error: string | null = null;
  private _history: History = {};
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
    const spec = TAB_HISTORY[this._tab];
    if (!grow || !spec) return;
    const ids = spec.keys.map((k) => grow.entities[k]).filter(Boolean);
    if (!ids.length) {
      this._history = {};
      return;
    }
    const end = Date.now();
    const start = end - spec.hours * 3600 * 1000;
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
    } catch {
      // history integration missing or recorder disabled: charts stay empty
      this._history = {};
    }
  }

  private _select(ev: Event): void {
    this._selected = (ev.target as HTMLSelectElement).value;
    localStorage.setItem(STORAGE_GROW, this._selected);
    this._refresh();
  }

  private _setTab(tab: TabId): void {
    if (tab === this._tab) return;
    this._tab = tab;
    localStorage.setItem(STORAGE_TAB, tab);
    this._history = {};
    this._refresh(); // phase timeline / targets may have changed, then history
  }

  // --- render --------------------------------------------------------------

  private _header(grow: Grow | undefined, c?: Ctx): TemplateResult {
    const t = this._t;
    return html`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Precision Grow</div>
        ${this._grows && this._grows.length > 1
          ? html`<select @change=${this._select} aria-label="Grow">
              ${this._grows.map((g) => html`<option value=${g.entry_id}
                ?selected=${g.entry_id === grow?.entry_id}>${g.title}</option>`)}
            </select>`
          : grow ? html`<div class="growname">${grow.title}</div>` : nothing}
      </div>
      ${grow && c ? html`
        <div class="tabs" role="tablist">
          ${TABS.map((id) => html`<button role="tab" aria-selected=${id === this._tab}
            class=${id === this._tab ? "active" : ""} @click=${() => this._setTab(id)}>${t.tabs[id]}</button>`)}
        </div>
        <div class="summary">
          <span class="phase">${t.phases[grow.phase] ?? grow.phase}</span>
          ${c.num("day_total") !== null ? html`<span>${t.day} ${c.num("day_total")}</span>` : nothing}
          ${c.num("day_in_phase") !== null ? html`<span>${c.num("day_in_phase")}. ${t.day_in_phase}</span>` : nothing}
          ${this._alertChip(c)}
        </div>` : nothing}`;
  }

  private _alertChip(c: Ctx): Tpl {
    const st = c.state("alert_level");
    if (!st) return nothing;
    const count = st.attributes.count ?? 0;
    return html`<button class="chip ${st.state}" @click=${() => c.moreInfo("alert_level")}>
      ${count ? `${this._t.alerts}: ${count}` : this._t.no_alerts}</button>`;
  }

  private _alerts(c: Ctx): Tpl {
    const items = c.state("alert_level")?.attributes.items as Alert[] | undefined;
    if (!items?.length) return nothing;
    return html`<div class="card wide">
      <h2>${this._t.alerts}</h2>
      ${items.map((a) => html`<div class="alert ${a.severity}">${alertText(this._t, a)}</div>`)}
    </div>`;
  }

  private _body(c: Ctx): Tpl {
    switch (this._tab) {
      case "nutrients": return nutrientsTab(c);
      case "energy": return energyTab(c);
      case "log": return growLogTab(c);
      default: return html`${this._alerts(c)}${overviewTab(c)}`;
    }
  }

  render(): TemplateResult {
    const t = this._t;
    if (this._error) return html`${this._header(undefined)}<div class="msg">${this._error}</div>`;
    if (this._grows === null) return html`${this._header(undefined)}<div class="msg">${t.loading}</div>`;
    const grow = this._grow;
    if (!grow) return html`${this._header(undefined)}<div class="msg">${t.no_grow}</div>`;
    const c = new Ctx(this.hass, grow, t, this._history, this);
    return html`${this._header(grow, c)}<div class="content">${this._body(c)}</div>`;
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
    .tabs { display: flex; gap: 4px; padding: 0 12px; overflow-x: auto;
      background: var(--app-header-background-color, var(--primary-color));
      border-bottom: 1px solid var(--divider-color); }
    .tabs button { all: unset; cursor: pointer; padding: 10px 14px; font-size: 14px; white-space: nowrap;
      color: var(--app-header-text-color, var(--text-primary-color)); opacity: 0.7;
      border-bottom: 2px solid transparent; }
    .tabs button.active { opacity: 1; border-bottom-color: var(--primary-color); font-weight: 500; }
    .tabs button:focus-visible { outline: 2px solid var(--primary-color); }
    .summary { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 16px 0;
      color: var(--secondary-text-color); font-size: 14px; }
    .phase { color: var(--primary-text-color); font-weight: 500; font-size: 16px; }
    .content { display: grid; gap: 16px; padding: 16px;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); align-items: start; }
    .card { background: var(--card-background-color); border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, none); border: 1px solid var(--divider-color); padding: 16px; }
    .card.wide { grid-column: 1 / -1; }
    h2 { margin: 0 0 12px; font-size: 16px; font-weight: 500; }
    h3 { margin: 16px 0 6px; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
    .tile { all: unset; cursor: pointer; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px;
      border-radius: 8px; background: var(--secondary-background-color); border-left: 3px solid transparent; }
    .tile.static { cursor: default; }
    .tile:focus-visible { outline: 2px solid var(--primary-color); }
    .tile.optimal { border-left-color: var(--success-color, #43a047); }
    .tile.high, .tile.low, .tile.warning { border-left-color: var(--warning-color, #ffa000); }
    .tile.critical { border-left-color: var(--error-color, #db4437); }
    .tlabel { font-size: 12px; color: var(--secondary-text-color); }
    .tval { font-size: 20px; font-variant-numeric: tabular-nums; }
    .tval.small { font-size: 15px; }
    .tsub { font-size: 11px; color: var(--secondary-text-color); }
    .muted { color: var(--secondary-text-color); font-size: 13px; }
    .small { font-size: 12px; }
    .progress { height: 6px; border-radius: 3px; background: var(--secondary-background-color);
      margin-top: 12px; overflow: hidden; }
    .progress div { height: 100%; background: var(--warning-color, #ffa000); }
    .row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
    .row span:first-child { flex: 1; }
    .badge { font-size: 12px; padding: 2px 8px; border-radius: 10px; background: var(--secondary-background-color); }
    .chip { all: unset; cursor: pointer; font-size: 12px; padding: 2px 10px; border-radius: 10px;
      background: var(--secondary-background-color); color: var(--primary-text-color); }
    .chip.warning, .badge.warning { background: var(--warning-color, #ffa000); color: #000; }
    .chip.critical, .badge.critical { background: var(--error-color, #db4437); color: #fff; }
    .alert { padding: 6px 10px; border-radius: 6px; margin-top: 6px; font-size: 14px;
      border-left: 3px solid var(--info-color, #039be5); background: var(--secondary-background-color); }
    .alert.warning { border-left-color: var(--warning-color, #ffa000); }
    .alert.critical { border-left-color: var(--error-color, #db4437); }
    form { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; align-items: end; }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--secondary-text-color); }
    label.wide { grid-column: 1 / -1; }
    input, textarea { font: inherit; font-size: 15px; color: var(--primary-text-color);
      background: var(--secondary-background-color); border: 1px solid var(--divider-color);
      border-radius: 6px; padding: 8px; box-sizing: border-box; width: 100%; }
    input:user-invalid { border-color: var(--error-color, #db4437); }
    form button { font: inherit; cursor: pointer; padding: 9px 16px; border: none; border-radius: 6px;
      background: var(--primary-color); color: var(--text-primary-color, #fff); justify-self: start; }
    form button:disabled { opacity: 0.5; cursor: default; }
    .bars { display: flex; flex-direction: column; gap: 6px; }
    .bar { all: unset; cursor: pointer; display: grid; grid-template-columns: minmax(80px, 30%) 1fr auto;
      gap: 8px; align-items: center; font-size: 13px; }
    .bname { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .btrack { height: 8px; border-radius: 4px; background: var(--secondary-background-color); overflow: hidden; }
    .btrack span { display: block; height: 100%; background: var(--pg-cost, #ffb74d); }
    .bval { font-variant-numeric: tabular-nums; }
    .list { list-style: none; margin: 0; padding: 0; font-size: 13px; }
    .list li { display: flex; gap: 10px; align-items: center; padding: 5px 0;
      border-bottom: 1px solid var(--divider-color); }
    .list li:last-child { border-bottom: none; }
    .list .grow { flex: 1; }
    .swatch { width: 10px; height: 10px; border-radius: 2px; }
    .timeline { display: flex; height: 14px; border-radius: 7px; overflow: hidden; margin-bottom: 8px; }
    .seg { min-width: 2px; }
    .diary { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); }
    .entry { display: flex; gap: 10px; font-size: 14px; }
    .entry img, .noimg { width: 72px; height: 72px; object-fit: cover; border-radius: 6px; flex: none;
      background: var(--secondary-background-color); }
    .edate { font-weight: 500; }
    .msg { padding: 24px 16px; color: var(--secondary-text-color); }
  `;
}

if (!customElements.get("precision-grow-panel")) {
  customElements.define("precision-grow-panel", PrecisionGrowPanel);
}
