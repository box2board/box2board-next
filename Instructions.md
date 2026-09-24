# Box2Board project and deployment instructions

This file preserves the repository's original operating intent while distinguishing the retired prototype from the current application. The legacy implementation remains under `_legacy/` for reference; it is not part of the deployed route tree.

## Current application

Box2Board currently ships a server-rendered MLB, NBA, NFL, and NHL scoreboard. Keep the application server-driven and easy to reason about:

1. Put provider fetch and transformation logic under `lib/`.
2. Validate external responses before rendering them.
3. Keep private credentials server-side. Never expose them through `NEXT_PUBLIC_*` variables.
4. Cache provider responses at an interval appropriate to the data and show an honest fetch/check timestamp.
5. Expose explicit loading, empty, stale, and provider-error states. Never replace unavailable live data with mock values.
6. Verify new public routes on narrow phones and desktop before promotion.

The schedule-day convention is `America/New_York`; use `Intl` time-zone handling rather than fixed UTC offsets so daylight-saving transitions remain correct.

## Local setup

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run start
```

No sports API key, Vercel KV database, or cron job is required by the current scoreboard. Data is requested server-side and cached through Next.js revalidation.

## Vercel deployment

1. Import the repository into the existing Vercel project with the Next.js preset and repository root `/`.
2. Leave the build command as `npm run build` and install command as `npm install`.
3. Confirm `box2board.com` is assigned to the **Production** environment in Vercel. Canonical metadata intentionally always points to `https://box2board.com`.
4. Deploy the branch to Preview first. Preview and development responses must include `X-Robots-Tag: noindex, nofollow, noarchive`, and preview `robots.txt` must disallow crawling.
5. Follow `LAUNCH_CHECKLIST.md` before promoting the already-built artifact. Do not deploy to Production or alter DNS without explicit authorization.

`VERCEL_ENV` is supplied by Vercel and is used to distinguish production from previews. No user-supplied environment variables are required for the scoreboard. Optional MLB matchup insights require the server-side configuration described in `MATCHUP_INSIGHTS.md`.

## Retired prototype configuration — preserved for migration context

The original repository instructions called for all of the following:

- `API_SPORTS_KEY` for API-Sports odds and props.
- `KV_REST_API_URL` and `KV_REST_API_TOKEN` for Vercel KV caching.
- Daily and hourly cron handlers under `/api/cron/`.
- MLB hit-rate and weather endpoints, NFL weather and game endpoints, NBA scorer data, odds routes, and mock fallback values.

Those requirements genuinely conflict with the requested trustworthy launch: the active repository did not contain the described integrations, `vercel.json` did not define those cron schedules, and mock betting data could be mistaken for current information. They were therefore removed from the public app rather than silently represented as working. The historical files are retained under `_legacy/`; do not reconnect them without provider credentials, validation, failure handling, cost review, and real-data verification.

The original extension requirement remains valid in principle: new widgets should use modular server-side fetchers, a cache, and scheduled warming when warranted. If durable storage or cron warming becomes necessary, configure a supported Vercel storage product, protect cron endpoints with `CRON_SECRET`, document costs and limits, and verify the deployed runtime before exposing the feature.

## Preserved roadmap, with launch requirements

The earlier roadmap proposed first-inning baseball probabilities, player props, injuries, weather models, and historical trends. These are product ideas—not current capabilities. Before adding one:

- obtain a licensed or explicitly permitted data source;
- document its update cadence, attribution requirements, quota, and cost;
- distinguish factual statistics from Box2Board calculations;
- publish methodology and limitations for derived metrics;
- never infer injuries from a missing player or describe a projection as a verified outcome.

The recommended next phase is detailed in `NEXT_PHASE.md`.
