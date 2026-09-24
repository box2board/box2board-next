import type { LeagueConfig, LeagueKey } from "./types";
import type { PublicLeague } from "./sports";

export const leagues: LeagueConfig[] = [
  { key: "mlb", label: "MLB", path: "/mlb", accent: "#4cd3ff" },
  { key: "nba", label: "NBA", path: "/nba", accent: "#ff7b7b" },
  { key: "nfl", label: "NFL", path: "/nfl", accent: "#9b8cff" },
  { key: "nhl", label: "NHL", path: "/nhl", accent: "#7bffb5" },
  { key: "golf", label: "Golf", path: "/golf", accent: "#f5d76e" },
];

export const publicLeagues = leagues.filter((league) => ["mlb", "nba", "nfl", "nhl"].includes(league.key));

export const leagueKeys = leagues.map((league) => league.key);

export const getLeagueConfig = (key: string) =>
  leagues.find((league) => league.key === key);

export const isPublicLeague = (key: string): key is PublicLeague =>
  publicLeagues.some((league) => league.key === key);

export const isLeagueKey = (key: string): key is LeagueKey =>
  leagueKeys.includes(key as LeagueKey);
