import { isPublicLeague } from "@/lib/leagues";

const retiredRoutes: Record<string, string> = {
  lines: "Game lines are not published because Box2Board does not have a verified live odds source.",
  "game-props": "Game props are not published because Box2Board does not have a verified live props source.",
  "player-props": "Player props are not published because Box2Board does not have a verified live props source.",
};

export function GET(
  _request: Request,
  { params }: { params: { league: string; retired: string } },
) {
  if (!isPublicLeague(params.league) || !retiredRoutes[params.retired]) {
    return new Response("Not found", { status: 404 });
  }

  const league = params.league.toUpperCase();
  const detail = retiredRoutes[params.retired];
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Feature retired | Box2Board</title><style>body{margin:0;background:#0b0f14;color:#f5f7fa;font:16px/1.55 system-ui,sans-serif}main{width:min(680px,calc(100% - 32px));margin:12vh auto}small{color:#f06a54;font-weight:800;letter-spacing:.12em}h1{font-size:clamp(2.4rem,8vw,4.5rem);line-height:1;margin:.25em 0}p{color:#9da8b5}a{display:inline-block;margin-top:1rem;color:#ff735e;font-weight:750}</style></head><body><main><small>410 · RETIRED ROUTE</small><h1>This prototype feature is off the board.</h1><p>${detail}</p><p>The current ${league} desk publishes verified schedules, statuses, and scores.</p><a href="/${params.league}">Open the ${league} scoreboard →</a></main></body></html>`,
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
