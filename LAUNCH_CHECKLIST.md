# Box2Board launch checklist

## Complete and locally verified

- [x] Focused navigation for MLB, NBA, NFL, and NHL only.
- [x] Server-rendered scoreboards with provider status text and no mock fallback.
- [x] Provider response validation, 6.5-second timeout, one-minute revalidation, and distinct empty/error states.
- [x] America/New_York schedule days and times, including `Intl` daylight-saving handling.
- [x] Previous/next date controls, responsive score cards, keyboard focus, skip navigation, semantic landmarks, and intentional 404/410 responses.
- [x] Production canonical URLs fixed to `https://box2board.com`.
- [x] Preview/development `robots.txt` disallow rules and `X-Robots-Tag` response protection; production is indexable.
- [x] Metadata, social preview image, favicon, sitemap, and structured website data.
- [x] About/contact copy uses verified facts and no invented contact channel.
- [x] Production build completes locally.

## Actual launch blockers

- **A Vercel preview is not connected in this checkout.** There is no `.vercel/project.json`, Vercel CLI, auth token, or Git remote, and registry policy blocks installing the CLI. Real runtime and visual verification are incomplete.
- **Real data must be verified from Preview.** This workspace blocks the external scoreboard endpoint. Validate all four league feeds, caching, an empty date, and provider-error behavior before merge or promotion.
- **Confirm the production domain assignment.** In Vercel Project → Settings → Domains, verify `box2board.com` targets Production. Do not change DNS as part of this review.
- Configure a verified contact channel before promotion if public support is expected.

## Hosting configuration

No custom environment variables are required. Vercel supplies `VERCEL_ENV`. Canonical metadata and sitemap entries always use `https://box2board.com`; previews are deliberately canonicalized to production and blocked from indexing.

To obtain a preview when access is restored:

1. Connect this checkout with `vercel link` to the existing Box2Board project, or push the branch to its connected Git repository.
2. Run `vercel` (not `vercel --prod`) or open the deployment created by the Git integration.
3. Confirm the preview response includes `X-Robots-Tag: noindex, nofollow, noarchive` and `/robots.txt` contains `Disallow: /`.
4. Open `/`, `/mlb`, `/nba`, `/nfl`, `/nhl`, `/about`, a removed props route, and a nonexistent route.
5. Compare representative dates, teams, statuses, and scores with official league score pages.
6. Request a live page twice within 60 seconds and once after 60 seconds; confirm the “Provider checked” value is stable inside the cache window and advances after revalidation completes. It describes response receipt, not the provider's last score change.
7. Verify an offseason/off-day returns a successful empty board while a blocked provider request produces “Provider unavailable.”
8. Inspect at 360, 768, and 1440 pixels, including horizontal overflow, keyboard navigation, focus visibility, date controls, cards, and console/network errors. Capture screenshots.
9. Confirm Production `/robots.txt` allows crawling only after promotion, `/sitemap.xml` uses `box2board.com`, and canonical/Open Graph URLs are correct.

## Provider costs and limits

The scoreboard reads ESPN's public site endpoint without a credential. No fee was introduced, but it is not a contracted API and the repository has no documented quota, redistribution license, uptime guarantee, or support commitment. Availability and schema changes remain a launch risk. A licensed source should be selected before building the next-phase context product.
