import { unstable_cache } from "next/cache";
import { parseContextPage, type ContextGame } from "./matchups";
import { scheduleDateKey, shiftDateKey } from "./sports";

export function matchupsEnabled() { return process.env.MLB_MATCHUPS_ENABLED === "true" && Boolean(process.env.BALLDONTLIE_API_KEY); }
export type MatchupSnapshot = { games: ContextGame[]; checkedAt?: string; error?: string };

// One shared snapshot per Eastern day, not one provider call per visitor or team.
// Include a one-day boundary buffer and filter locally because provider date semantics can differ.
export async function fetchMatchupWindow(day: string, key: string, request: typeof fetch = fetch): Promise<MatchupSnapshot> {
  const dates = Array.from({length:10}, (_,i) => shiftDateKey(day, i-8));
  const games: ContextGame[] = []; const cursors = new Set<number>(); let cursor: number | null = null;
  const controller = new AbortController(); const timer = setTimeout(()=>controller.abort(), 10000);
  try {
    for (let page=0; page<3; page++) {
      const url = new URL("https://api.balldontlie.io/mlb/v1/games");
      url.searchParams.set("per_page", "100");
      dates.forEach(d=>url.searchParams.append("dates[]", `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6)}`));
      if (cursor !== null) url.searchParams.set("cursor", String(cursor));
      const response = await request(url.toString(), { cache:"no-store", signal:controller.signal, headers:{Authorization:key, Accept:"application/json"} });
      if (!response.ok) throw new Error("Results unavailable");
      const parsed = parseContextPage(await response.json()); games.push(...parsed.games);
      if (parsed.next === null) return { games:[...new Map(games.map(g=>[g.id,g])).values()], checkedAt:new Date().toISOString() };
      if (cursors.has(parsed.next)) throw new Error("Incomplete results");
      cursors.add(parsed.next); cursor=parsed.next;
    }
    throw new Error("Incomplete results");
  } catch {
    // Cache failures too: do not hammer a free-tier API or render a partial page as complete.
    return {games:[], error:"Matchup history is temporarily unavailable. Scores remain available on the MLB desk."};
  } finally { clearTimeout(timer); }
}
const cachedWindow = unstable_cache(async (day: string) => fetchMatchupWindow(day, process.env.BALLDONTLIE_API_KEY || ""), ["mlb-matchup-window-v1"], {revalidate:900});
export async function getMatchupSnapshot() {
  if (!matchupsEnabled()) return {games:[], error:"Matchup insights are not enabled."} as MatchupSnapshot;
  return cachedWindow(scheduleDateKey());
}
