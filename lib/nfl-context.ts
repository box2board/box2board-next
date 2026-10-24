import { scheduleDateKey } from "./sports";

export interface NflContextTeam {
  id: number;
  name: string;
  abbreviation: string;
}

export interface NflContextGame {
  id: number;
  date: string;
  day: string;
  season: number;
  state: string;
  home: NflContextTeam;
  away: NflContextTeam;
  homeScore: number | null;
  awayScore: number | null;
}

const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

const score = (value: unknown) =>
  typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;

function team(value: unknown): NflContextTeam {
  const raw = object(value);
  if (
    !Number.isInteger(raw.id) ||
    Number(raw.id) <= 0 ||
    typeof raw.full_name !== "string" ||
    !raw.full_name.trim() ||
    typeof raw.abbreviation !== "string" ||
    !raw.abbreviation.trim()
  ) {
    throw new Error("Invalid NFL team data");
  }
  return {
    id: Number(raw.id),
    name: raw.full_name,
    abbreviation: raw.abbreviation,
  };
}

export function parseNflContextPage(
  payload: unknown,
): { games: NflContextGame[]; next: number | null } {
  const raw = object(payload);
  const meta = object(raw.meta);
  if (
    !Array.isArray(raw.data) ||
    (!raw.meta || typeof raw.meta !== "object" || Array.isArray(raw.meta)) ||
    (meta.next_cursor != null &&
      (!Number.isInteger(meta.next_cursor) || Number(meta.next_cursor) < 0))
  ) {
    throw new Error("Invalid NFL games response");
  }

  const games = raw.data.map((value: unknown): NflContextGame => {
    const game = object(value);
    if (
      !Number.isInteger(game.id) ||
      typeof game.date !== "string" ||
      !Number.isFinite(Date.parse(game.date)) ||
      !Number.isInteger(game.season)
    ) {
      throw new Error("Invalid NFL game data");
    }

    const home = team(game.home_team);
    const away = team(game.visitor_team);
    if (home.id === away.id) throw new Error("Invalid NFL opponents");

    const providerState = typeof game.status_state === "string"
      ? game.status_state
      : "";
    const status = typeof game.status === "string" ? game.status.toLowerCase() : "";
    const state = providerState ||
      (status.includes("final") ? "final" : status.includes("progress") ? "in_progress" : "scheduled");

    return {
      id: Number(game.id),
      date: new Date(game.date).toISOString(),
      day: scheduleDateKey(new Date(game.date)),
      season: Number(game.season),
      state,
      home,
      away,
      homeScore: score(game.home_team_score),
      awayScore: score(game.visitor_team_score),
    };
  });

  return {
    games,
    next: meta.next_cursor == null ? null : Number(meta.next_cursor),
  };
}

export interface NflFormResult {
  id: number;
  day: string;
  opponent: string;
  location: "vs" | "at";
  scored: number;
  allowed: number;
  result: "W" | "L" | "T";
}

export interface NflTeamForm {
  results: NflFormResult[];
  wins: number;
  losses: number;
  ties: number;
  scored: number | null;
  allowed: number | null;
  missingScores: boolean;
}

export function nflTeamForm(
  games: NflContextGame[],
  target: NflContextGame,
  teamId: number,
): NflTeamForm {
  const eligible = [...new Map(games.map(game => [game.id, game])).values()]
    .filter(game =>
      game.id !== target.id &&
      game.state === "final" &&
      game.season === target.season &&
      game.date < target.date &&
      (game.home.id === teamId || game.away.id === teamId)
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const missingScores = eligible.some(
    game => game.homeScore === null || game.awayScore === null,
  );

  if (missingScores) {
    return {
      results: [],
      wins: 0,
      losses: 0,
      ties: 0,
      scored: null,
      allowed: null,
      missingScores: true,
    };
  }

  const results = eligible.slice(0, 4).map((game): NflFormResult => {
    const home = game.home.id === teamId;
    const scored = (home ? game.homeScore : game.awayScore)!;
    const allowed = (home ? game.awayScore : game.homeScore)!;
    return {
      id: game.id,
      day: game.day,
      opponent: home ? game.away.abbreviation : game.home.abbreviation,
      location: home ? "vs" : "at",
      scored,
      allowed,
      result: scored > allowed ? "W" : scored < allowed ? "L" : "T",
    };
  });

  return {
    results,
    wins: results.filter(result => result.result === "W").length,
    losses: results.filter(result => result.result === "L").length,
    ties: results.filter(result => result.result === "T").length,
    scored: results.length
      ? results.reduce((total, result) => total + result.scored, 0) / results.length
      : null,
    allowed: results.length
      ? results.reduce((total, result) => total + result.allowed, 0) / results.length
      : null,
    missingScores: false,
  };
}

export interface NflIntelligenceSignal {
  id: "form" | "prevention" | "scoring";
  eyebrow: string;
  headline: string;
  detail: string;
}

type TeamPulse = { team: NflContextTeam; form: NflTeamForm };
type MatchupPulse = {
  game: NflContextGame;
  away: NflTeamForm;
  home: NflTeamForm;
  combinedScoring: number;
};

function hasUsefulForm(form: NflTeamForm) {
  return !form.missingScores &&
    form.results.length >= 2 &&
    form.scored !== null &&
    form.allowed !== null;
}

function record(form: NflTeamForm) {
  return form.ties
    ? `${form.wins}–${form.losses}–${form.ties}`
    : `${form.wins}–${form.losses}`;
}

export function buildNflDailyIntelligence(
  games: NflContextGame[],
  day: string,
): NflIntelligenceSignal[] {
  const targets = [...new Map(
    games
      .filter(game =>
        game.day === day &&
        ["scheduled", "in_progress", "final", "delayed"].includes(game.state)
      )
      .map(game => [game.id, game]),
  ).values()].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);

  const teamsById = new Map<number, TeamPulse>();
  const matchups: MatchupPulse[] = [];

  for (const game of targets) {
    const away = nflTeamForm(games, game, game.away.id);
    const home = nflTeamForm(games, game, game.home.id);
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

  const winRate = (row: TeamPulse) =>
    (row.form.wins + row.form.ties * 0.5) / row.form.results.length;
  const pointDiff = (row: TeamPulse) => row.form.scored! - row.form.allowed!;
  const signals: NflIntelligenceSignal[] = [];

  const formLeader = [...teams].sort((a, b) =>
    winRate(b) - winRate(a) ||
    pointDiff(b) - pointDiff(a) ||
    b.form.results.length - a.form.results.length ||
    a.team.abbreviation.localeCompare(b.team.abbreviation)
  )[0];

  signals.push({
    id: "form",
    eyebrow: "Form leader",
    headline: `${formLeader.team.abbreviation} ${record(formLeader.form)} over its recent games`,
    detail: `${formLeader.form.scored!.toFixed(1)} points scored and ${formLeader.form.allowed!.toFixed(1)} allowed per game across ${formLeader.form.results.length} completed games.`,
  });

  const preventionLeader = [...teams].sort((a, b) =>
    a.form.allowed! - b.form.allowed! ||
    pointDiff(b) - pointDiff(a) ||
    b.form.results.length - a.form.results.length ||
    a.team.abbreviation.localeCompare(b.team.abbreviation)
  )[0];

  signals.push({
    id: "prevention",
    eyebrow: "Defensive form",
    headline: `${preventionLeader.team.abbreviation} allowing ${preventionLeader.form.allowed!.toFixed(1)} points/game`,
    detail: `Lowest recent points-allowed average among NFL teams playing today, across ${preventionLeader.form.results.length} completed games.`,
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
      headline: `${scoringWatch.game.away.abbreviation} at ${scoringWatch.game.home.abbreviation}: ${scoringWatch.combinedScoring.toFixed(1)} combined recent points/game`,
      detail: `Based on each offense’s recent scoring average (${scoringWatch.away.results.length} and ${scoringWatch.home.results.length} completed games). Context only—not a projected total.`,
    });
  }

  return signals;
}

export interface NflTeamTrend {
  team: NflContextTeam;
  games: number;
  wins: number;
  losses: number;
  ties: number;
  winRate: number;
  scored: number;
  allowed: number;
  pointDifferential: number;
}

export interface NflMatchupTrend {
  game: NflContextGame;
  away: NflTeamTrend;
  home: NflTeamTrend;
  combinedScoring: number;
}

export interface NflTrendBoard {
  teams: NflTeamTrend[];
  matchups: NflMatchupTrend[];
}

function trendFromForm(
  team: NflContextTeam,
  form: NflTeamForm,
): NflTeamTrend | null {
  if (!hasUsefulForm(form)) return null;
  return {
    team,
    games: form.results.length,
    wins: form.wins,
    losses: form.losses,
    ties: form.ties,
    winRate: (form.wins + form.ties * 0.5) / form.results.length,
    scored: form.scored!,
    allowed: form.allowed!,
    pointDifferential: form.scored! - form.allowed!,
  };
}

export function buildNflTrendBoard(
  games: NflContextGame[],
  day: string,
): NflTrendBoard {
  const targets = [...new Map(
    games
      .filter(game =>
        game.day === day &&
        ["scheduled", "in_progress", "final", "delayed"].includes(game.state)
      )
      .map(game => [game.id, game]),
  ).values()].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);

  const teamsById = new Map<number, NflTeamTrend>();
  const matchups: NflMatchupTrend[] = [];

  for (const game of targets) {
    const away = trendFromForm(game.away, nflTeamForm(games, game, game.away.id));
    const home = trendFromForm(game.home, nflTeamForm(games, game, game.home.id));
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

  const teams = [...teamsById.values()].sort((a, b) =>
    b.winRate - a.winRate ||
    b.pointDifferential - a.pointDifferential ||
    b.games - a.games ||
    a.team.abbreviation.localeCompare(b.team.abbreviation)
  );

  matchups.sort((a, b) =>
    b.combinedScoring - a.combinedScoring ||
    a.game.date.localeCompare(b.game.date) ||
    a.game.id - b.game.id
  );

  return { teams, matchups };
}

export function formatNflRecord(row: Pick<NflTeamTrend, "wins" | "losses" | "ties">) {
  return row.ties ? `${row.wins}–${row.losses}–${row.ties}` : `${row.wins}–${row.losses}`;
}
