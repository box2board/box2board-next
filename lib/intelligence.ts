import type { MlbIntelligenceSignal } from "./matchups";
import type { NflIntelligenceSignal } from "./nfl-context";

export type IntelligenceLeague = "mlb" | "nfl" | "nba" | "nhl" | "pga";
export type IntelligenceKind = "trend" | "matchup" | "injury" | "model" | "performance" | "movement";

export interface DailyIntelligenceItem {
  id: string;
  league: IntelligenceLeague;
  leagueLabel: string;
  kind: IntelligenceKind;
  label: string;
  headline: string;
  detail: string;
  href: string;
  priority: number;
}

export interface DailyIntelligenceSnapshot {
  items: DailyIntelligenceItem[];
  checkedAt?: string;
  sources: string[];
}

const SIGNAL_KIND = {
  form: "trend",
  prevention: "trend",
  scoring: "matchup",
} as const satisfies Record<"form" | "prevention" | "scoring", IntelligenceKind>;

const SIGNAL_PRIORITY = {
  form: 100,
  prevention: 90,
  scoring: 80,
} as const;

export function mlbSignalsToDailyIntelligence(
  signals: MlbIntelligenceSignal[],
): DailyIntelligenceItem[] {
  return signals.map((signal) => ({
    id: `mlb-${signal.id}`,
    league: "mlb",
    leagueLabel: "MLB",
    kind: SIGNAL_KIND[signal.id],
    label: signal.eyebrow,
    headline: signal.headline,
    detail: signal.detail,
    href: signal.id === "scoring" ? "/mlb/insights" : "/mlb/trends",
    priority: SIGNAL_PRIORITY[signal.id],
  }));
}

export function nflSignalsToDailyIntelligence(
  signals: NflIntelligenceSignal[],
): DailyIntelligenceItem[] {
  return signals.map((signal) => ({
    id: `nfl-${signal.id}`,
    league: "nfl",
    leagueLabel: "NFL",
    kind: SIGNAL_KIND[signal.id],
    label: signal.eyebrow,
    headline: signal.headline,
    detail: signal.detail,
    href: "/nfl/trends",
    priority: SIGNAL_PRIORITY[signal.id],
  }));
}

export function rankDailyIntelligence(items: DailyIntelligenceItem[], limit = 8) {
  return [...items]
    .sort((a, b) =>
      b.priority - a.priority ||
      a.league.localeCompare(b.league) ||
      a.id.localeCompare(b.id)
    )
    .slice(0, limit);
}
