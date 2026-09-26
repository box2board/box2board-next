import { unstable_cache } from "next/cache";
import { parseNflContextPage, type NflContextGame } from "./nfl-context";
import { scheduleDateKey, shiftDateKey } from "./sports";

export type NflContextSnapshot = {
  games: NflContextGame[];
  checkedAt?: string;
  error?: string;
};

export function nflTrendsEnabled() {
  return process.env.NFL_TRENDS_ENABLED === "true" &&
    Boolean(process.env.BALLDONTLIE_API_KEY);
}

export async function fetchNflContextWindow(
  day: string,
  key: string,
  request: typeof fetch = fetch,
): Promise<NflContextSnapshot> {
  const dates = Array.from({ length: 37 }, (_, index) => shiftDateKey(day, index - 36));
  const games: NflContextGame[] = [];
  const cursors = new Set<number>();
  let cursor: number | null = null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    for (let page = 0; page < 2; page++) {
      const url = new URL("https://api.balldontlie.io/nfl/v1/games");
      url.searchParams.set("per_page", "100");
      url.searchParams.append("season_types[]", "2");
      dates.forEach(date =>
        url.searchParams.append(
          "dates[]",
          `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`,
        ),
      );
      if (cursor !== null) url.searchParams.set("cursor", String(cursor));

      const response = await request(url.toString(), {
        cache: "no-store",
        signal: controller.signal,
        headers: { Authorization: key, Accept: "application/json" },
      });
      if (!response.ok) throw new Error("NFL results unavailable");

      const parsed = parseNflContextPage(await response.json());
      games.push(...parsed.games);
      if (parsed.next === null) {
        return {
          games: [...new Map(games.map(game => [game.id, game])).values()],
          checkedAt: new Date().toISOString(),
        };
      }
      if (cursors.has(parsed.next)) throw new Error("Incomplete NFL results");
      cursors.add(parsed.next);
      cursor = parsed.next;
    }
    throw new Error("Incomplete NFL results");
  } catch {
    return {
      games: [],
      error: "NFL recent-form history is temporarily unavailable. Scores remain available on the NFL desk.",
    };
  } finally {
    clearTimeout(timer);
  }
}

const cachedWindow = unstable_cache(
  async (day: string) =>
    fetchNflContextWindow(day, process.env.BALLDONTLIE_API_KEY || ""),
  ["nfl-context-window-v1"],
  { revalidate: 900 },
);

export async function getNflContextSnapshot(day = scheduleDateKey()) {
  if (!nflTrendsEnabled()) {
    return { games: [], error: "NFL trends are not enabled." } as NflContextSnapshot;
  }
  return cachedWindow(day);
}
