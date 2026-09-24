const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");

const source = fs.readFileSync("lib/sports.ts", "utf8").replace(
  'import { unstable_cache } from "next/cache";',
  'const unstable_cache = (callback: unknown) => callback;',
);
const output = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;
const sportsModule = new Module("sports-test");
sportsModule.filename = "sports-test.js";
sportsModule._compile(output, sportsModule.filename);
const sports = sportsModule.exports;

assert.equal(
  sports.scheduleDateKey(new Date("2026-09-24T01:30:00Z")),
  "20260923",
);
assert.equal(
  sports.scheduleDateKey(new Date("2026-03-08T04:30:00Z")),
  "20260307",
);
assert.equal(
  sports.scheduleDateKey(new Date("2026-03-08T07:30:00Z")),
  "20260308",
);
assert.equal(
  sports.scheduleDateKey(new Date("2026-11-01T05:30:00Z")),
  "20261101",
);
assert.equal(sports.shiftDateKey("20260228", 1), "20260301");

const event = (id, date) => ({
  id,
  date,
  competitions: [
    {
      status: { type: { state: "post", shortDetail: "Final" } },
      competitors: [
        {
          homeAway: "home",
          score: "4",
          team: { shortDisplayName: "Home", abbreviation: "HOM" },
        },
        {
          homeAway: "away",
          score: "2",
          team: { shortDisplayName: "Away", abbreviation: "AWY" },
        },
      ],
    },
  ],
});

const board = sports.parseScoreboard(
  {
    events: [
      event("included", "2026-09-24T01:30:00Z"),
      event("excluded", "2026-09-24T05:00:00Z"),
    ],
  },
  "mlb",
  "20260923",
  "2026-09-24T01:31:00Z",
);
assert.deepEqual(board.games.map((game) => game.id), ["included"]);
assert.equal(board.games[0].home.score, "4");
assert.equal(board.checkedAt, "2026-09-24T01:31:00Z");
assert.equal(board.error, undefined);

const empty = sports.parseScoreboard({ events: [] }, "nhl", "20260923");
assert.equal(empty.games.length, 0);
assert.equal(empty.error, undefined);
assert.ok(empty.checkedAt);
assert.throws(
  () => sports.parseScoreboard({}, "nba", "20260923"),
  /Unexpected provider response/,
);

console.log("sports date, transformation, and empty/error assertions passed");
