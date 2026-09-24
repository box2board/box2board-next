import { scheduleDateKey, shiftDateKey } from "./sports";

export interface ContextTeam { id: number; name: string; abbreviation: string }
export interface ContextGame {
  id: number; date: string; day: string; season: number; seasonType: string;
  state: string; home: ContextTeam; away: ContextTeam; homeRuns: number | null; awayRuns: number | null;
}
const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const runs = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
function team(value: unknown): ContextTeam {
  const raw = object(value);
  if (!Number.isInteger(raw.id) || Number(raw.id) <= 0 || typeof raw.display_name !== "string" || !raw.display_name.trim() || typeof raw.abbreviation !== "string") throw new Error("Invalid team data");
  return { id: Number(raw.id), name: raw.display_name, abbreviation: raw.abbreviation };
}
export function parseContextPage(payload: unknown): { games: ContextGame[]; next: number | null } {
  const raw = object(payload); const meta = object(raw.meta);
  if (!Array.isArray(raw.data) || (!raw.meta || typeof raw.meta !== "object" || Array.isArray(raw.meta)) || (meta.next_cursor != null && (!Number.isInteger(meta.next_cursor) || Number(meta.next_cursor) < 0))) throw new Error("Invalid results response");
  const games = raw.data.map((value: unknown): ContextGame => {
    const g = object(value);
    if (!Number.isInteger(g.id) || typeof g.date !== "string" || !/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(g.date) || !Number.isFinite(Date.parse(g.date)) || !Number.isInteger(g.season)) throw new Error("Invalid game data");
    const home = team(g.home_team); const away = team(g.away_team);
    if (home.id === away.id) throw new Error("Invalid opponents");
    const state = typeof g.status_state === "string" ? g.status_state : g.status === "STATUS_FINAL" ? "final" : g.status === "STATUS_SCHEDULED" ? "scheduled" : "unknown";
    return { id: Number(g.id), date: new Date(g.date).toISOString(), day: scheduleDateKey(new Date(g.date)), season: Number(g.season), seasonType: typeof g.season_type === "string" ? g.season_type : "unknown", state, home, away, homeRuns: runs(object(g.home_team_data).runs), awayRuns: runs(object(g.away_team_data).runs) };
  });
  return { games, next: meta.next_cursor == null ? null : Number(meta.next_cursor) };
}
export interface FormResult { id: number; day: string; opponent: string; location: string; scored: number; allowed: number; result: "W" | "L" }
export interface TeamForm { results: FormResult[]; wins: number; losses: number; scored: number | null; allowed: number | null; missingScores: boolean }
/** Same season/type, previous seven Eastern days only; today's results never leak into the comparison. */
export function teamForm(games: ContextGame[], target: ContextGame, teamId: number): TeamForm {
  const start = shiftDateKey(target.day, -7);
  const eligible = [...new Map(games.map(g => [g.id, g])).values()].filter(g =>
    g.id !== target.id && g.state === "final" && g.day >= start && g.day < target.day && g.season === target.season && g.seasonType === target.seasonType && ["regular", "postseason", "spring_training"].includes(g.seasonType) && (g.home.id === teamId || g.away.id === teamId));
  const missingScores = eligible.some(g => g.homeRuns === null || g.awayRuns === null || g.homeRuns === g.awayRuns);
  const results: FormResult[] = eligible.filter(g => g.homeRuns !== null && g.awayRuns !== null && g.homeRuns !== g.awayRuns).sort((a,b) => b.date.localeCompare(a.date) || b.id-a.id).slice(0,5).map(g => {
    const home = g.home.id === teamId;
    const scored = (home ? g.homeRuns : g.awayRuns)!; const allowed = (home ? g.awayRuns : g.homeRuns)!;
    return { id:g.id, day:g.day, opponent:home ? g.away.abbreviation : g.home.abbreviation, location:home ? "vs" : "at", scored, allowed, result:scored > allowed ? "W" : "L" };
  });
  // Do not silently present an incomplete history as the latest five.
  if (missingScores) return { results:[], wins:0, losses:0, scored:null, allowed:null, missingScores:true };
  return { results, wins:results.filter(r=>r.result === "W").length, losses:results.filter(r=>r.result === "L").length, scored:results.length ? results.reduce((n,r)=>n+r.scored,0)/results.length : null, allowed:results.length ? results.reduce((n,r)=>n+r.allowed,0)/results.length : null, missingScores:false };
}
export function displayDay(day: string) { return `${day.slice(4,6)}/${day.slice(6,8)}`; }
