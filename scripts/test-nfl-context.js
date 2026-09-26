const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const loaded = {};

function load(name) {
  if (loaded[name]) return loaded[name];
  const mod = new Module(name);
  mod.require = id =>
    id === "next/cache"
      ? { unstable_cache: callback => callback }
      : id.startsWith("./")
        ? load(id.slice(2))
        : require(id);
  mod._compile(
    ts.transpileModule(fs.readFileSync(`lib/${name}.ts`, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText,
    `${name}.js`,
  );
  return loaded[name] = mod.exports;
}

const {
  parseNflContextPage,
  nflTeamForm,
  buildNflDailyIntelligence,
  buildNflTrendBoard,
} = load("nfl-context");
const { fetchNflContextWindow, nflTrendsEnabled } = load("nfl-context-provider");

const team = (id, abbr) => ({
  id,
  full_name: `Team ${id}`,
  abbreviation: abbr,
});
const raw = (
  id,
  date,
  home = 24,
  away = 17,
  state = "final",
) => ({
  id,
  date,
  season: 2026,
  postseason: false,
  status: state === "final" ? "Final" : "Scheduled",
  status_state: state,
  home_team: team(1, "HOM"),
  visitor_team: team(2, "AWY"),
  home_team_score: state === "final" ? home : null,
  visitor_team_score: state === "final" ? away : null,
});
const page = (data, next = null) => ({ data, meta: { next_cursor: next } });

const target = parseNflContextPage(
  page([raw(99, "2026-09-27T17:00:00Z", 0, 0, "scheduled")]),
).games[0];

const games = parseNflContextPage(page([
  raw(1, "2026-09-20T17:00:00Z", 28, 14),
  raw(2, "2026-09-13T17:00:00Z", 21, 24),
  raw(3, "2026-09-06T17:00:00Z", 31, 20),
  raw(4, "2026-08-30T17:00:00Z", 17, 17),
])).games;

const home = nflTeamForm(games, target, 1);
assert.equal(home.results.length, 4);
assert.equal(home.wins, 2);
assert.equal(home.losses, 1);
assert.equal(home.ties, 1);
assert.equal(home.scored, 24.25);
assert.equal(home.allowed, 18.75);
const earlySeasonSignals = buildNflDailyIntelligence([...games.slice(0, 2), target], target.day);
assert.equal(earlySeasonSignals.length, 3);

const signals = buildNflDailyIntelligence([...games, target], target.day);
assert.equal(signals.length, 3);
assert.ok(signals.some(signal => signal.id === "form"));
assert.ok(signals.some(signal => signal.id === "prevention"));
assert.ok(signals.some(signal => signal.id === "scoring"));

const board = buildNflTrendBoard([...games, target], target.day);
assert.equal(board.teams.length, 2);
assert.equal(board.matchups.length, 1);
assert.equal(board.teams[0].games, 4);

assert.throws(() => parseNflContextPage({ data: [], meta: [] }));
assert.throws(() => parseNflContextPage(page([raw(1, "bad")])));

(async () => {
  let calls = 0;
  const result = await fetchNflContextWindow(
    "20260927",
    "test-key",
    async (url, options) => {
      const parsed = new URL(url);
      assert.equal(options.headers.Authorization, "test-key");
      assert.equal(parsed.searchParams.getAll("dates[]").length, 37);
      assert.deepEqual(parsed.searchParams.getAll("season_types[]"), ["2"]);
      calls++;
      return {
        ok: true,
        json: async () => page([raw(calls, "2026-09-20T17:00:00Z")], calls === 1 ? 42 : null),
      };
    },
  );
  assert.equal(calls, 2);
  assert.equal(result.games.length, 2);
  assert.ok(result.checkedAt);

  const failure = await fetchNflContextWindow(
    "20260927",
    "test-key",
    async () => ({ ok: false }),
  );
  assert.ok(failure.error);

  const loop = await fetchNflContextWindow(
    "20260927",
    "test-key",
    async () => ({ ok: true, json: async () => page([], 42) }),
  );
  assert.ok(loop.error);

  delete process.env.NFL_TRENDS_ENABLED;
  delete process.env.BALLDONTLIE_API_KEY;
  assert.equal(nflTrendsEnabled(), false);

  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  let snapshot = { games: [...games, target], checkedAt: new Date().toISOString() };
  let enabled = true;
  const view = new Module("nfl-trend-view");
  view.require = id => {
    if (id === "next/link") return { default: ({ children, ...props }) => React.createElement("a", props, children) };
    if (id === "next/navigation") return { notFound: () => { throw new Error("not-found"); } };
    if (id === "@/lib/nfl-context-provider") return { nflTrendsEnabled: () => enabled, getNflContextSnapshot: async () => snapshot };
    if (id === "@/lib/nfl-context") return load("nfl-context");
    if (id === "@/lib/matchup-provider") return { matchupsEnabled: () => false, getMatchupSnapshot: async () => ({ games: [] }) };
    if (id === "@/lib/matchups") return load("matchups");
    if (id === "@/lib/sports") return { ...load("sports"), scheduleDateKey: () => target.day, SCHEDULE_TIME_ZONE: "America/New_York" };
    return require(id);
  };
  view._compile(
    ts.transpileModule(
      fs.readFileSync("app/(leagues)/[league]/trends/page.tsx", "utf8"),
      { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
    ).outputText,
    "nfl-trend-view.js",
  );

  const render = async () =>
    renderToStaticMarkup(await view.exports.default({ params: Promise.resolve({ league: "nfl" }) }));
  const html = await render();
  assert.ok(html.includes("NFL trend board"));
  assert.ok(html.includes("PF/G"));
  assert.ok(html.includes("combined recent points/game"));
  snapshot = { games: [], error: "Unavailable" };
  assert.ok((await render()).includes("Trend board temporarily unavailable"));
  enabled = false;
  await assert.rejects(render, /not-found/);

  console.log("NFL context calculations, provider window, trend rendering, and failure assertions passed");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
