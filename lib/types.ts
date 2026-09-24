export type LeagueKey = "mlb" | "nba" | "nfl" | "nhl" | "golf";

export interface LeagueConfig {
  key: LeagueKey;
  label: string;
  path: string;
  accent: string;
}
