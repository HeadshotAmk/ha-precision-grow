// Minimal subset of the Home Assistant frontend types used by the panel.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language: string };
  themes?: { darkMode?: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
}

export interface Grow {
  entry_id: string;
  title: string;
  phase: string;
  targets: Record<string, number | [number, number]>;
  dli_target: [number | null, number | null];
  brightness_target: number | null;
  entities: Record<string, string>;
  start_date?: string | null;
  phase_timeline?: { phase: string; date: string }[];
  sources?: Record<string, string>;
  calibration?: Record<string, number | null>;
}

/** Compressed history state (minimal_response): s = state, lu = last_updated (s). */
export interface HistoryPoint {
  s: string;
  lu: number;
}

export type History = Record<string, HistoryPoint[]>;
