# MLB matchup insights (optional preview feature)

Route: `/mlb/insights`. Compare each team's latest five completed games within the previous seven Eastern calendar days. Show wins/losses, average runs scored/allowed, sample size, and expandable underlying results. Same season and season type only. Today's results never enter the comparison; doubleheaders count separately. Missing scores withhold that team's comparison rather than silently shrinking the sample.

## Provider and activation

BALLDONTLIE MLB games API: https://mlb.balldontlie.io/
Terms: https://www.balldontlie.io/terms.html
The provider documents commercial display and derived analytics as permitted. The free tier documented on September 24, 2026 includes games at 5 requests/minute. Review current terms and limits before activation. No paid plan is required for this implementation; no account or purchase has been made.

Set these server-side environment variables in Vercel **Preview**, then rebuild:

- `BALLDONTLIE_API_KEY`: your provider key; never use a NEXT_PUBLIC name or commit the value.
- `MLB_MATCHUPS_ENABLED`: `true`.

Without both, the route renders the not-found experience and the homepage/MLB desk links stay hidden. The existing scoreboard needs no key. Verify a real authenticated response and manually compare the displayed results to official MLB results before enabling Production. Do not treat fixture tests as provider verification.

The window is cached for 15 minutes per Eastern day, including failures. Each refresh makes at most three sequential requests of 100 results, with a total 10-second abort deadline. Partial pagination is withheld. There are no retries, cron jobs, arbitrary historical queries, or per-team requests. Concurrent cold instances and separate deployments can still consume the shared account quota; enable only the primary preview while validating, monitor usage, and do not enable duplicate Vercel projects. A rate-limit response displays an unavailable state.

## Validation

`npm test` covers date boundaries, home/away scoring, zero scores, incomplete results, deduplication, doubleheaders, sample limits, season type filtering, pagination and provider failures. `npm run build` validates production compilation and types. Fixtures exist only in the test script. Server-rendered success, empty, unavailable and disabled states are also tested. Browser automation could not start in this workspace (daemon exited); visual viewport verification remains a preview release gate.

Before promotion: inspect 360px, 768px and 1440px layouts; expand included results using keyboard/touch; test success, empty and provider-error states. Confirm no credential in HTML or browser requests. Live provider validation is outstanding until the owner configures their key. The existing Next.js 14.1.0 dependency emitted a security deprecation warning during installation; assess and update it separately before promoting new functionality.
