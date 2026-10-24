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


export interface MlbIntelligenceSignal {
  id: "form" | "prevention" | "scoring";
  eyebrow: string;
  headline: string;
  detail: string;
}

type TeamPulse = { team: ContextTeam; form: TeamForm };
type MatchupPulse = { game: ContextGame; away: TeamForm; home: TeamForm; combinedScoring: number };

function hasUsefulForm(form: TeamForm) {
  return !form.missingScores && form.results.length >= 3 && form.scored !== null && form.allowed !== null;
}

/**
 * Builds a small, descriptive intelligence layer from the same verified recent-form
 * data used by the MLB matchup page. Signals are deterministic and never presented
 * as predictions.
 */
export function buildMlbDailyIntelligence(games: ContextGame[], day: string): MlbIntelligenceSignal[] {
  const targets = [...new Map(
    games
      .filter(g => g.day === day && ["scheduled", "in_progress", "final", "delayed"].includes(g.state))
      .map(g => [g.id, g]),
  ).values()].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);

  const teamsById = new Map<number, TeamPulse>();
  const matchups: MatchupPulse[] = [];

  for (const game of targets) {
    const away = teamForm(games, game, game.away.id);
    const home = teamForm(games, game, game.home.id);

    if (hasUsefulForm(away)) teamsById.set(game.away.id, { team: game.away, form: away });
    if (hasUsefulForm(home)) teamsById.set(game.home.id, { team: game.home, form: home });

    if (hasUsefulForm(away) && hasUsefulForm(home)) {
      matchups.push({
        game,
        away,
        home,
        combinedScoring: away.scored! + home.scored!,
      });
    }
  }

  const teams = [...teamsById.values()];
  if (!teams.length) return [];

  const winRate = (row: TeamPulse) => row.form.wins / row.form.results.length;
  const runDiff = (row: TeamPulse) => row.form.scored! - row.form.allowed!;
  const signals: MlbIntelligenceSignal[] = [];

  const formLeader = [...teams].sort((a, b) =>
    winRate(b) - winRate(a) ||
    runDiff(b) - runDiff(a) ||
    b.form.results.length - a.form.results.length ||
    a.team.abbreviation.localeCompare(b.team.abbreviation)
  )[0];

  signals.push({
    id: "form",
    eyebrow: "Form leader",
    headline: `${formLeader.team.abbreviation} ${formLeader.form.wins}–${formLeader.form.losses} in recent form`,
    detail: `${formLeader.form.scored!.toFixed(1)} runs scored and ${formLeader.form.allowed!.toFixed(1)} allowed per game across ${formLeader.form.results.length} completed games.`,
  });

  const preventionLeader = [...teams].sort((a, b) =>
    a.form.allowed! - b.form.allowed! ||
    runDiff(b) - runDiff(a) ||
    b.form.results.length - a.form.results.length ||
    a.team.abbreviation.localeCompare(b.team.abbreviation)
  )[0];

  signals.push({
    id: "prevention",
    eyebrow: "Run prevention",
    headline: `${preventionLeader.team.abbreviation} allowing ${preventionLeader.form.allowed!.toFixed(1)} runs/game`,
    detail: `Lowest recent runs-allowed average among teams on today’s board, across ${preventionLeader.form.results.length} completed games.`,
  });

  const scoringWatch = [...matchups].sort((a, b) =>
    b.combinedScoring - a.combinedScoring ||
    a.game.date.localeCompare(b.game.date) ||
    a.game.id - b.game.id
  )[0];

  if (scoringWatch) {
    signals.push({
      id: "scoring",
      eyebrow: "Scoring watch",
      headline: `${scoringWatch.game.away.abbreviation} at ${scoringWatch.game.home.abbreviation}: ${scoringWatch.combinedScoring.toFixed(1)} combined recent runs/game`,
      detail: `Based on each offense’s recent scoring average (${scoringWatch.away.results.length} and ${scoringWatch.home.results.length} completed games). Context only—not a forecast.`,
    });
  }

  return signals;
}


export interface MlbTeamTrend {
  team: ContextTeam;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  scored: number;
  allowed: number;
  runDifferential: number;
}

export interface MlbMatchupTrend {
  game: ContextGame;
  away: MlbTeamTrend;
  home: MlbTeamTrend;
  combinedScoring: number;
}

export interface MlbTrendBoard {
  teams: MlbTeamTrend[];
  matchups: MlbMatchupTrend[];
}

function trendFromForm(team: ContextTeam, form: TeamForm): MlbTeamTrend | null {
  if (!hasUsefulForm(form)) return null;
  return {
    team,
    games: form.results.length,
    wins: form.wins,
    losses: form.losses,
    winRate: form.wins / form.results.length,
    scored: form.scored!,
    allowed: form.allowed!,
    runDifferential: form.scored! - form.allowed!,
  };
}

/**
 * Builds the MLB trend board from teams playing on the requested day.
 * All rows use the same previous-seven-day window and require at least
 * three completed games so small one- or two-game samples are withheld.
 */
export function buildMlbTrendBoard(games: ContextGame[], day: string): MlbTrendBoard {
  const targets = [...new Map(
    games
      .filter(g => g.day === day && ["scheduled", "in_progress", "final", "delayed"].includes(g.state))
      .map(g => [g.id, g]),
  ).values()].sort((a,b) => a.date.localeCompare(b.date) || a.id-b.id);

  const teamsById = new Map<number, MlbTeamTrend>();
  const matchups: MlbMatchupTrend[] = [];

  for (const game of targets) {
    const away = trendFromForm(game.away, teamForm(games, game, game.away.id));
    const home = trendFromForm(game.home, teamForm(games, game, game.home.id));
    if (away) teamsById.set(away.team.id, away);
    if (home) teamsById.set(home.team.id, home);
    if (away && home) {
      matchups.push({
        game,
        away,
        home,
        combinedScoring: away.scored + home.scored,
      });
    }
  }

  const teams = [...teamsById.values()].sort((a,b) =>
    b.winRate-a.winRate ||
    b.runDifferential-a.runDifferential ||
    b.games-a.games ||
    a.team.abbreviation.localeCompare(b.team.abbreviation)
  );

  matchups.sort((a,b) =>
    b.combinedScoring-a.combinedScoring ||
    a.game.date.localeCompare(b.game.date) ||
    a.game.id-b.game.id
  );

  return { teams, matchups };
}
