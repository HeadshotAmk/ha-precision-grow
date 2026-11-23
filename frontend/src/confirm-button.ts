// Two-step button for risky actions: the first click arms it (shows the
// confirm text), a second click within 5 s runs the action. Fires "confirmed".

import { LitElement, css, html } from "lit";

const ARM_MS = 5000;

export class PgConfirmButton extends LitElement {
  static properties = {
    label: { type: String },
    confirmLabel: { type: String, attribute: "confirm-label" },
    disabled: { type: Boolean },
    _armed: { state: true },
  };

  label = "";
  confirmLabel = "";
  disabled = false;
  private _armed = false;
  private _timer?: number;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) window.clearTimeout(this._timer);
  }

  private _click(): void {
    if (this.disabled) return;
    if (!this._armed) {
      this._armed = true;
      this._timer = window.setTimeout(() => (this._armed = false), ARM_MS);
      return;
    }
    if (this._timer) window.clearTimeout(this._timer);
    this._armed = false;
    this.dispatchEvent(new CustomEvent("confirmed", { bubbles: true, composed: true }));
  }

  render() {
    return html`<button class=${this._armed ? "armed" : ""} ?disabled=${this.disabled}
      @click=${this._click}>${this._armed ? this.confirmLabel : this.label}</button>`;
  }

  static styles = css`
    button { font: inherit; cursor: pointer; padding: 8px 14px; border-radius: 6px;
      border: 1px solid var(--divider-color); background: var(--secondary-background-color);
      color: var(--primary-text-color); }
    button.armed { background: var(--error-color, #db4437); border-color: var(--error-color, #db4437); color: #fff; }
    button:disabled { opacity: 0.5; cursor: default; }
  `;
}

if (!customElements.get("pg-confirm-button")) customElements.define("pg-confirm-button", PgConfirmButton);
