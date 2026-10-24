# NFL trends (optional preview feature)

Route: `/nfl/trends`.

This feature adds recent-form intelligence for NFL teams playing on the current Eastern schedule day. It uses only the BALLDONTLIE NFL **Games** endpoint, which is available on the provider's free tier. It does not use paid injury, team-stat, odds, player-prop, or advanced-stat endpoints.

## What it calculates

For each team playing today, Box2Board examines up to the previous four completed regular-season games and calculates:

- recent record, including ties;
- points scored per game;
- points allowed per game;
- recent point differential;
- matchup combined recent scoring average.

At least two completed games are required before a team is surfaced. The displayed sample size makes early-season context explicit. These are descriptive statistics, not predictions or projected totals.

## Provider and activation

Provider documentation: https://nfl.balldontlie.io/

Provider terms: https://www.balldontlie.io/terms.html

The NFL Games endpoint is listed as available on the free tier at 5 requests/minute. The integration reuses the server-side `BALLDONTLIE_API_KEY` already supported by the repository and adds one feature flag:

- `NFL_TRENDS_ENABLED=true`

Do not use a `NEXT_PUBLIC_` credential. Enable the feature in Preview first, rebuild, and compare the displayed game history with an official NFL source before enabling Production.

## Request/caching design

The server fetches a 37-day date window ending on the requested day, regular season only. It requests up to 100 games per page, follows at most two pages, deduplicates game IDs, and withholds partial pagination. Results and failures are cached for 15 minutes. A total 10-second abort deadline prevents long provider stalls.

This design is intentionally compatible with the provider's free 5 requests/minute tier, but duplicate Vercel projects can still multiply cold-start traffic. Keep only the intended Preview/Production project connected while validating.

## Future upgrades

BALLDONTLIE lists player injuries and team/team-season stats on paid NFL tiers. Those could later power Injury Impact, usage/efficiency trends, and richer matchup context. They are not required for this first NFL intelligence layer.
