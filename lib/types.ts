export type LeagueKey = "mlb" | "nba" | "nfl" | "nhl" | "golf";

export interface LeagueConfig {
  key: LeagueKey;
  label: string;
  path: string;
  accent: string;
}

export interface Game {
  id: string;
  league: LeagueKey;
  away: string;
  home: string;
  startTime: string;
  status: "Scheduled" | "Live" | "Final";
}

export interface MarketLine {
  gameId: string;
  matchup: string;
  moneyline: string;
  spread: string;
  total: string;
  movement: string;
}

export interface GameProp {
  id: string;
  label: string;
  description: string;
  price: string;
  trend: string;
}

export interface PlayerProp {
  id: string;
  player: string;
  team: string;
  stat: string;
  line: number;
  odds: string;
  insight: string;
}
