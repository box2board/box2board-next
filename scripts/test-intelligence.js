const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

function transpile(path) {
  return ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
}

const logic = new Module("intelligence-test");
logic.filename = "intelligence-test.js";
logic._compile(transpile("lib/intelligence.ts"), logic.filename);
const {
  mlbSignalsToDailyIntelligence,
  nflSignalsToDailyIntelligence,
  rankDailyIntelligence,
} = logic.exports;

const mlbSignals = [
  { id: "scoring", eyebrow: "Scoring watch", headline: "A at B", detail: "8.2 combined" },
  { id: "form", eyebrow: "Form leader", headline: "A 4–1", detail: "Recent form" },
  { id: "prevention", eyebrow: "Run prevention", headline: "B 2.1 RA/G", detail: "Recent prevention" },
];
const nflSignals = [
  { id: "form", eyebrow: "Form leader", headline: "BUF 3–1", detail: "Recent form" },
  { id: "prevention", eyebrow: "Defensive form", headline: "DET 17.0 PA/G", detail: "Recent defense" },
  { id: "scoring", eyebrow: "Scoring watch", headline: "BAL at KC", detail: "52.0 combined" },
];

const mlbItems = mlbSignalsToDailyIntelligence(mlbSignals);
const nflItems = nflSignalsToDailyIntelligence(nflSignals);
assert.equal(mlbItems.length, 3);
assert.equal(nflItems.length, 3);
assert.equal(mlbItems.find(item => item.id === "mlb-scoring").kind, "matchup");
assert.equal(mlbItems.find(item => item.id === "mlb-form").href, "/mlb/trends");
assert.equal(nflItems.find(item => item.id === "nfl-form").href, "/nfl/trends");
assert.equal(nflItems.find(item => item.id === "nfl-prevention").kind, "trend");

const ranked = rankDailyIntelligence([...nflItems, ...mlbItems]);
assert.equal(ranked.length, 6);
assert.ok(ranked[0].priority >= ranked[1].priority);
assert.equal(rankDailyIntelligence(ranked, 2).length, 2);

const component = new Module("daily-intelligence-view");
component.filename = "daily-intelligence-view.js";
component.require = id => {
  if (id === "next/link") {
    return { default: ({ children, ...props }) => React.createElement("a", props, children) };
  }
  if (id === "@/lib/intelligence") return {};
  return require(id);
};
component._compile(transpile("components/DailyIntelligence.tsx"), component.filename);
const DailyIntelligence = component.exports.default;
const html = renderToStaticMarkup(
  React.createElement(DailyIntelligence, { items: ranked }),
);
assert.ok(html.includes("What matters today"));
assert.ok(html.includes("Top signal"));
assert.ok(html.includes("Verified data only"));
assert.ok(html.includes("MLB"));
assert.ok(html.includes("NFL"));
assert.ok(html.includes("Explore context"));
assert.equal(
  renderToStaticMarkup(React.createElement(DailyIntelligence, { items: [] })),
  "",
);

console.log("Cross-sport intelligence mapping, ranking, and rendering assertions passed");
