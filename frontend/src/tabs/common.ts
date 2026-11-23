import type { Series } from "../chart";

export const COLORS = {
  temp: "var(--pg-temp, #e57373)",
  rh: "var(--pg-rh, #4fc3f7)",
  vpd: "var(--pg-vpd, #81c784)",
  weight: "var(--pg-weight, #ba68c8)",
  dryback: "var(--pg-dryback, #ffb74d)",
  ec: "var(--pg-ec, #9575cd)",
  ph: "var(--pg-ph, #4db6ac)",
  cost: "var(--pg-cost, #ffb74d)",
};

/** Axis range: last `hours`, but start at the first point when history is shorter. */
export function chartRange(series: Series[], hours: number): [number, number] {
  const end = Date.now();
  const rangeStart = end - hours * 3600 * 1000;
  const first = Math.min(...series.map((s) => s.points[0]?.[0] ?? Infinity));
  return [isFinite(first) ? Math.max(rangeStart, first) : rangeStart, end];
}

/** Submit handler wrapper: prevent navigation, run, reset the form on success. */
export function onSubmit(fn: (form: HTMLFormElement) => Promise<boolean>) {
  return async (ev: Event) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const button = form.querySelector("button[type=submit]") as HTMLButtonElement | null;
    if (button) button.disabled = true;
    try {
      if (await fn(form)) form.reset();
    } finally {
      if (button) button.disabled = false;
    }
  };
}
