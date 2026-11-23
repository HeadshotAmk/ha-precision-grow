// Shared helpers for all tabs: entity lookup, formatting, tiles, service calls.

import { html, nothing, type TemplateResult } from "lit";
import type { Strings } from "./i18n";
import type { Grow, History, HomeAssistant } from "./types";

export type Status = "optimal" | "high" | "low" | "warning" | "critical" | "ok" | undefined;
export type Tpl = TemplateResult | typeof nothing;

export class Ctx {
  constructor(
    public hass: HomeAssistant,
    public grow: Grow,
    public t: Strings,
    public history: History,
    private host: HTMLElement,
  ) {}

  get lang(): string {
    return this.hass.locale?.language ?? this.hass.language;
  }

  state(key: string) {
    const id = this.grow.entities[key];
    return id ? this.hass.states[id] : undefined;
  }

  has(key: string): boolean {
    return !!this.state(key);
  }

  num(key: string): number | null {
    const st = this.state(key);
    if (!st) return null;
    const v = parseFloat(st.state);
    return isFinite(v) ? v : null;
  }

  number(v: number, decimals = 1): string {
    return v.toLocaleString(this.lang, { maximumFractionDigits: decimals });
  }

  fmt(key: string, decimals = 1): string {
    const st = this.state(key);
    if (!st || st.state === "unknown" || st.state === "unavailable") return "–";
    const v = parseFloat(st.state);
    const unit = st.attributes.unit_of_measurement ?? "";
    if (!isFinite(v)) return st.state;
    const n = this.number(v, decimals);
    return unit ? `${n} ${unit}` : n;
  }

  status(key: string): Status {
    return this.state(key)?.state as Status;
  }

  range(r: unknown, unit: string): string {
    if (!Array.isArray(r) || r[0] == null || r[1] == null) return "";
    return `${this.t.target} ${r[0]}–${r[1]} ${unit}`;
  }

  band(key: string): [number, number] | null {
    const r = this.grow.targets[key];
    return Array.isArray(r) ? [r[0], r[1]] : null;
  }

  date(iso: string | undefined | null): string {
    if (!iso) return "–";
    const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(this.lang, { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  moreInfo(key: string): void {
    const entityId = this.grow.entities[key] ?? key;
    this.host.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
    );
  }

  toast(message: string): void {
    this.host.dispatchEvent(
      new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }),
    );
  }

  /** Call a precision_grow service for this grow; toast on success or error. */
  async service(service: string, data: Record<string, unknown>): Promise<boolean> {
    try {
      await this.hass.callService("precision_grow", service, { entry_id: this.grow.entry_id, ...data });
      this.toast(this.t.saved);
      return true;
    } catch (err: any) {
      this.toast(`${this.t.save_failed}: ${err?.message ?? err}`);
      return false;
    }
  }

  points(key: string, live = true): [number, number][] {
    const id = this.grow.entities[key];
    const raw = id ? this.history[id] : undefined;
    if (!raw) return [];
    const out: [number, number][] = [];
    for (const p of raw) {
      const v = parseFloat(p.s);
      if (isFinite(v)) out.push([p.lu * 1000, v]);
    }
    const cur = this.num(key);
    if (live && out.length && cur !== null) out.push([Date.now(), cur]);
    return out;
  }

  tile(key: string, label: string, opts: { decimals?: number; sub?: string; status?: Status; value?: string } = {}): Tpl {
    if (!this.grow.entities[key]) return nothing;
    return html`
      <button class="tile ${opts.status ?? ""}" @click=${() => this.moreInfo(key)}>
        <span class="tlabel">${label}</span>
        <span class="tval">${opts.value ?? this.fmt(key, opts.decimals)}</span>
        ${opts.sub ? html`<span class="tsub">${opts.sub}</span>` : nothing}
      </button>`;
  }
}

/** Read named numeric/text fields from a form; empty numbers are omitted. */
export function formValues(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {};
  new FormData(form).forEach((v, k) => {
    const s = String(v).trim();
    if (s !== "") out[k] = s;
  });
  return out;
}

export function toNumber(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = parseFloat(v.replace(",", "."));
  return isFinite(n) ? n : undefined;
}
