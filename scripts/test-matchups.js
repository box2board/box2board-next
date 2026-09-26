const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const loaded = {};
function load(name) {
  if (loaded[name]) return loaded[name];
  const mod = new Module(name);
  mod.require = id => id === 'next/cache' ? {unstable_cache: callback => callback} : id.startsWith('./') ? load(id.slice(2)) : require(id);
  mod._compile(ts.transpileModule(fs.readFileSync(`lib/${name}.ts`, 'utf8'), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText, `${name}.js`);
  return loaded[name] = mod.exports;
}
const {parseContextPage, teamForm, buildMlbDailyIntelligence, buildMlbTrendBoard} = load('matchups');
const {fetchMatchupWindow, matchupsEnabled} = load('matchup-provider');
const team = id => ({id, display_name:`Team ${id}`, abbreviation:`T${id}`});
const raw = (id, date, home=4, away=2) => ({id,date,season:2026,season_type:'regular',status_state:'final',home_team:team(1),away_team:team(2),home_team_data:{runs:home},away_team_data:{runs:away}});
const page = (data, next=null) => ({data,meta:{next_cursor:next}});
const target = parseContextPage(page([raw(99,'2026-09-24T23:00:00Z')])).games[0];
const games = parseContextPage(page([
  raw(1,'2026-09-23T23:00:00Z',0,2), raw(2,'2026-09-23T18:00:00Z',6,1),
  raw(3,'2026-09-24T02:00:00Z',3,1), // Previous Eastern day
  raw(4,'2026-09-24T18:00:00Z',20,0), // Today excluded
  raw(5,'2026-09-16T23:00:00Z',20,0), // Too old
  {...raw(6,'2026-09-22T23:00:00Z',20,0),season_type:'postseason'},
  {...raw(7,'2026-09-22T23:00:00Z',20,0),status_state:'in_progress'},
])).games;
const form = teamForm([...games,games[0]],target,1);
assert.deepEqual(form.results.map(r=>r.id),[3,1,2]);
assert.equal(form.wins,2); assert.equal(form.losses,1);
assert.equal(form.scored,3); assert.equal(form.allowed,4/3);
assert.equal(teamForm(games,target,2).wins,1);
assert.equal(teamForm([],target,1).scored,null);
const intelligence = buildMlbDailyIntelligence([...games,target], target.day);
assert.equal(intelligence.length,3);
assert.ok(intelligence.some(signal=>signal.id==='form'));
assert.ok(intelligence.some(signal=>signal.id==='prevention'));
assert.ok(intelligence.some(signal=>signal.id==='scoring'));
assert.deepEqual(buildMlbDailyIntelligence([],target.day),[]);
const trendBoard = buildMlbTrendBoard([...games,target], target.day);
assert.equal(trendBoard.teams.length,2);
assert.equal(trendBoard.matchups.length,1);
assert.ok(trendBoard.teams[0].games >= 3);
assert.equal(buildMlbTrendBoard([],target.day).teams.length,0);
const incomplete = parseContextPage(page([raw(8,'2026-09-22T23:00:00Z',null,1)])).games;
assert.equal(teamForm([...games,...incomplete],target,1).missingScores,true);
assert.equal(teamForm([...games,...incomplete],target,1).results.length,0);
assert.throws(()=>parseContextPage(page([raw(1,'bad')])));
assert.throws(()=>parseContextPage({data:[],meta:[]}));
assert.throws(()=>parseContextPage({data:[],meta:{next_cursor:'x'}}));
const six = parseContextPage(page(Array.from({length:6},(_,i)=>raw(i+10,`2026-09-${23-i}T23:00:00Z`)))).games;
assert.equal(teamForm(six,target,1).results.length,5);
(async()=>{
  let calls=0;
  const result = await fetchMatchupWindow('20260924','test-key',async(url,options)=>{
    assert.equal(options.headers.Authorization,'test-key');
    assert.equal(new URL(url).searchParams.getAll('dates[]').length,10);
    calls++;
    return {ok:true,json:async()=>page([raw(calls,'2026-09-23T23:00:00Z')],calls===1?42:null)};
  });
  assert.equal(calls,2); assert.equal(result.games.length,2); assert.ok(result.checkedAt);
  const failure = await fetchMatchupWindow('20260924','test-key',async()=>({ok:false}));
  assert.ok(failure.error); assert.deepEqual(failure.games,[]);
  const loop = await fetchMatchupWindow('20260924','test-key',async()=>({ok:true,json:async()=>page([],42)}));
  assert.ok(loop.error);
  delete process.env.MLB_MATCHUPS_ENABLED; delete process.env.BALLDONTLIE_API_KEY;
  assert.equal(matchupsEnabled(),false);
  const React = require('react');
  const {renderToStaticMarkup} = require('react-dom/server');
  let snapshot = {games:[...games,target],checkedAt:new Date().toISOString()};
  let enabled = true;
  const view = new Module('insights-view');
  view.require = id => {
    if(id==='next/link') return {default:({children,...props})=>React.createElement('a',props,children)};
    if(id==='next/navigation') return {notFound:()=>{throw new Error('not-found')}};
    if(id==='@/lib/matchup-provider') return {matchupsEnabled:()=>enabled,getMatchupSnapshot:async()=>snapshot};
    if(id==='@/lib/sports') return {...load('sports'),scheduleDateKey:()=>target.day};
    if(id==='@/lib/matchups') return load('matchups');
    if(id==='@/lib/nfl-context-provider') return {nflTrendsEnabled:()=>false,getNflContextSnapshot:async()=>({games:[]})};
    if(id==='@/lib/nfl-context') return {};
    return require(id);
  };
  view._compile(ts.transpileModule(fs.readFileSync('app/(leagues)/[league]/insights/page.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,'insights-view.js');
  const render = async()=>renderToStaticMarkup(await view.exports.default({params:Promise.resolve({league:'mlb'})}));
  const html = await render();
  assert.ok(html.includes('See included results')); assert.ok(html.includes('Runs scored / game'));
  assert.ok(!html.includes('test-key'));
  snapshot={games:[],error:'History unavailable'};
  assert.ok((await render()).includes('Insights temporarily unavailable'));
  snapshot={games:[]}; assert.ok((await render()).includes('No matchups listed today'));
  enabled=false; await assert.rejects(render,/not-found/);

  enabled=true;
  snapshot={games:[...games,target],checkedAt:new Date().toISOString()};
  const trendView = new Module('trend-board-view');
  trendView.require = id => {
    if(id==='next/link') return {default:({children,...props})=>React.createElement('a',props,children)};
    if(id==='next/navigation') return {notFound:()=>{throw new Error('not-found')}};
    if(id==='@/lib/matchup-provider') return {matchupsEnabled:()=>enabled,getMatchupSnapshot:async()=>snapshot};
    if(id==='@/lib/sports') return {...load('sports'),scheduleDateKey:()=>target.day,SCHEDULE_TIME_ZONE:'America/New_York'};
    if(id==='@/lib/matchups') return load('matchups');
    if(id==='@/lib/nfl-context-provider') return {nflTrendsEnabled:()=>false,getNflContextSnapshot:async()=>({games:[]})};
    if(id==='@/lib/nfl-context') return {};
    return require(id);
  };
  trendView._compile(ts.transpileModule(fs.readFileSync('app/(leagues)/[league]/trends/page.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,'trend-board-view.js');
  const renderTrends = async()=>renderToStaticMarkup(await trendView.exports.default({params:Promise.resolve({league:'mlb'})}));
  const trendHtml = await renderTrends();
  assert.ok(trendHtml.includes('Recent team form'));
  assert.ok(trendHtml.includes('Recent scoring environments'));
  assert.ok(trendHtml.includes('Diff/G'));
  assert.ok(!trendHtml.includes('test-key'));
  snapshot={games:[],error:'History unavailable'};
  assert.ok((await renderTrends()).includes('Trend board temporarily unavailable'));
  enabled=false; await assert.rejects(renderTrends,/not-found/);

  console.log('Matchup calculations, intelligence signals, trend board rendering, pagination and failure tests passed');
})().catch(error=>{console.error(error);process.exitCode=1;});
