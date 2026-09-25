// Run against a local production build or an authorized preview. No credentials required.
const assert = require('node:assert/strict');
const origin = process.argv[2] || 'http://127.0.0.1:3106';
const cases = [
  ['/', 200, 'Games &amp;'],
  ['/mlb', 200, 'scores &amp; schedule'],
  ['/nba?date=20260923', 200, 'September 23'],
  ['/nfl', 200, 'NFL'],
  ['/nhl', 200, 'NHL'],
  ['/about', 200, 'Box2Board'],
  ['/not-a-real-route', 404, 'That page'],
  ['/mlb/lines', 410, 'prototype feature'],
  ['/robots.txt', 200, 'User-Agent:'],
  ['/sitemap.xml', 200, 'https://box2board.com'],
];
(async () => {
  for (const [path, status, content] of cases) {
    const response = await fetch(new URL(path, origin), {signal: AbortSignal.timeout(20000)});
    assert.equal(response.status, status, path);
    const body = await response.text();
    assert.ok(body.includes(content), `${path}: expected content missing`);
    if (process.env.EXPECT_PREVIEW === 'true') {
      assert.ok(response.headers.get('x-robots-tag')?.includes('noindex'), `${path}: preview indexing protection missing`);
    }
    console.log(`PASS ${status} ${path}`);
  }
  const redirect = await fetch(new URL('/mlb/scores', origin), {redirect: 'manual'});
  assert.equal(redirect.status, 308);
  assert.equal(new URL(redirect.headers.get('location'), origin).pathname, '/mlb');
  const og = await fetch(new URL('/opengraph-image', origin), {signal: AbortSignal.timeout(20000)});
  assert.equal(og.status, 200);
  assert.ok(og.headers.get('content-type')?.includes('image/png'));
  assert.ok((await og.arrayBuffer()).byteLength > 1000);
  console.log('PASS legacy redirect and generated Open Graph image');
})().catch(error => { console.error(error); process.exitCode = 1; });
