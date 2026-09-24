# Box2Board next phase

The current product is a dependable scoreboard foundation, not yet a complete daily sports context product. The strongest next feature is a **matchup context card** built from licensed historical game and team statistics.

## 1. Matchup context cards — highest priority

For every scheduled game, show a small set of factual, reproducible comparisons:

- recent team results over a clearly stated window;
- home/away record for the current season;
- average points/runs/goals scored and allowed over the same window;
- confirmed starting pitcher or goalie only when explicitly supplied by the source;
- prior meetings in the current season, with sample size shown.

Every metric must identify its season/window and provider update time. Do not label descriptive statistics as predictions.

**Data required:** historical schedules/results, team season statistics, and confirmed probable starters. ESPN's public site feed is not a contracted foundation for this feature. Evaluate official league feeds or a licensed multi-sport provider before implementation.

**Cost:** unknown until a provider is selected. Expect free developer tiers to have request/history limits; obtain written pricing and redistribution terms before committing the product to one.

## 2. Daily notable performances

Summarize leaders from completed games using provider-supplied box scores: top scorers, pitchers, goalies, or other league-appropriate leaders. Use deterministic thresholds and link each item to its game; do not generate subjective claims from missing data.

**Data required:** licensed box scores and player IDs. **Cost:** provider-dependent.

## 3. Transparent trend pages

Once historical storage is operating reliably, publish queryable team trends with explicit filters, sample sizes, and definitions. Store provider snapshots in a durable database and run protected scheduled refreshes.

**Data required:** licensed historical results/statistics, database, protected scheduler. **Cost:** data plan plus Vercel database/function usage.

## Not recommended next

Odds, player props, injuries, and proprietary projections should not be the next launch feature. They require more volatile data, stricter licensing, additional user-safety context, or methodology that the current repository does not have.
