import { unstable_cache } from "next/cache";

export const SCHEDULE_TIME_ZONE = "America/New_York";

export const leagueSources = {
  mlb: { label: "MLB", sport: "baseball", slug: "mlb" },
  nba: { label: "NBA", sport: "basketball", slug: "nba" },
  nfl: { label: "NFL", sport: "football", slug: "nfl" },
  nhl: { label: "NHL", sport: "hockey", slug: "nhl" },
} as const;

export type PublicLeague = keyof typeof leagueSources;

export interface SportsTeam {
  name: string;
  abbreviation: string;
  score?: string;
}

export interface SportsGame {
  id: string;
  league: PublicLeague;
  startTime: string;
  status: string;
  state: "pre" | "in" | "post";
  away: SportsTeam;
  home: SportsTeam;
  venue?: string;
}

export interface Scoreboard {
  league: PublicLeague;
  label: string;
  date: string;
  games: SportsGame[];
  checkedAt?: string;
  error?: string;
}

/** Returns YYYYMMDD for the civil day in the Box2Board schedule time zone. */
export function scheduleDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHEDULE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}${part("month")}${part("day")}`;
}

export function shiftDateKey(key: string, days: number) {
  const date = new Date(
    `${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6)}T12:00:00Z`,
  );
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

export function validDateKey(value?: string) {
  if (!value || !/^\d{8}$/.test(value)) return scheduleDateKey();
  const iso = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}T12:00:00Z`;
  return Number.isNaN(new Date(iso).getTime()) ? scheduleDateKey() : value;
}

const text = (value: unknown) => (typeof value === "string" ? value : "");

export function parseScoreboard(
  payload: unknown,
  league: PublicLeague,
  date: string,
  checkedAt = new Date().toISOString(),
): Scoreboard {
  if (
    !payload ||
    typeof payload !== "object" ||
    !Array.isArray((payload as { events?: unknown }).events)
  ) {
    throw new Error("Unexpected provider response");
  }

  const games: SportsGame[] = [];
  for (const raw of (payload as { events: unknown[] }).events) {
    if (!raw || typeof raw !== "object") continue;
    const event = raw as Record<string, any>;
    const competition = event.competitions?.[0];
    const competitors = Array.isArray(competition?.competitors)
      ? competition.competitors
      : [];
    const away = competitors.find((item: any) => item?.homeAway === "away");
    const home = competitors.find((item: any) => item?.homeAway === "home");
    if (!text(event.id) || !text(event.date) || !away?.team || !home?.team) {
      continue;
    }

    // The provider can return boundary events around the requested date. Filtering
    // here guarantees the board matches the visible Eastern schedule day.
    if (scheduleDateKey(new Date(event.date)) !== date) continue;

    const providerState = competition?.status?.type?.state;
    const state =
      providerState === "in" || providerState === "post"
        ? providerState
        : "pre";
    games.push({
      id: event.id,
      league,
      startTime: event.date,
      status:
        text(competition?.status?.type?.shortDetail) ||
        text(event.status?.type?.description) ||
        "Status unavailable",
      state,
      away: {
        name: text(away.team.shortDisplayName) || text(away.team.displayName),
        abbreviation: text(away.team.abbreviation) || "AWY",
        score: away.score == null ? undefined : String(away.score),
      },
      home: {
        name: text(home.team.shortDisplayName) || text(home.team.displayName),
        abbreviation: text(home.team.abbreviation) || "HME",
        score: home.score == null ? undefined : String(home.score),
      },
      venue: text(competition?.venue?.fullName) || undefined,
    });
  }

  return {
    league,
    label: leagueSources[league].label,
    date,
    games: games.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    checkedAt,
  };
}

export async function getScoreboard(
  league: PublicLeague,
  date = scheduleDateKey(),
): Promise<Scoreboard> {
  const source = leagueSources[league];
  try {
    const result = await fetchProviderScoreboard(league, date);
    return parseScoreboard(result.payload, league, date, result.checkedAt);
  } catch (error) {
    return {
      league,
      label: source.label,
      date,
      games: [],
      error:
        error instanceof Error ? error.message : "Score provider unavailable",
    };
  }
}

const fetchProviderScoreboard = unstable_cache(
  async (league: PublicLeague, date: string) => {
    const source = leagueSources[league];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6500);
    try {
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/${source.sport}/${source.slug}/scoreboard?dates=${date}&limit=100`,
        {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        },
      );
      if (!response.ok) throw new Error(`Provider returned ${response.status}`);
      return {
        payload: await response.json(),
        checkedAt: new Date().toISOString(),
      };
    } finally {
      clearTimeout(timer);
    }
  },
  ["scoreboard-provider-v1"],
  { revalidate: 60 },
);

export async function getScoreboards(date = scheduleDateKey()) {
  return Promise.all(
    (Object.keys(leagueSources) as PublicLeague[]).map((league) =>
      getScoreboard(league, date),
    ),
  );
}
