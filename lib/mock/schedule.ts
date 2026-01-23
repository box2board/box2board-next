import type { Game, LeagueKey } from "../types";

export const scheduleByLeague: Record<LeagueKey, Game[]> = {
  mlb: [
    {
      id: "mlb-1",
      league: "mlb",
      away: "Dodgers",
      home: "Padres",
      startTime: "2024-09-12T23:05:00Z",
      status: "Scheduled",
    },
    {
      id: "mlb-2",
      league: "mlb",
      away: "Yankees",
      home: "Red Sox",
      startTime: "2024-09-12T22:10:00Z",
      status: "Live",
    },
    {
      id: "mlb-3",
      league: "mlb",
      away: "Cubs",
      home: "Cardinals",
      startTime: "2024-09-12T19:20:00Z",
      status: "Scheduled",
    },
  ],
  nba: [
    {
      id: "nba-1",
      league: "nba",
      away: "Warriors",
      home: "Lakers",
      startTime: "2024-11-08T03:00:00Z",
      status: "Scheduled",
    },
    {
      id: "nba-2",
      league: "nba",
      away: "Celtics",
      home: "Heat",
      startTime: "2024-11-08T00:30:00Z",
      status: "Scheduled",
    },
    {
      id: "nba-3",
      league: "nba",
      away: "Nuggets",
      home: "Suns",
      startTime: "2024-11-08T02:00:00Z",
      status: "Live",
    },
  ],
  nfl: [
    {
      id: "nfl-1",
      league: "nfl",
      away: "Chiefs",
      home: "Bills",
      startTime: "2024-10-20T00:20:00Z",
      status: "Scheduled",
    },
    {
      id: "nfl-2",
      league: "nfl",
      away: "Eagles",
      home: "Cowboys",
      startTime: "2024-10-20T20:25:00Z",
      status: "Scheduled",
    },
    {
      id: "nfl-3",
      league: "nfl",
      away: "Ravens",
      home: "Steelers",
      startTime: "2024-10-21T00:15:00Z",
      status: "Live",
    },
  ],
  nhl: [
    {
      id: "nhl-1",
      league: "nhl",
      away: "Rangers",
      home: "Maple Leafs",
      startTime: "2024-10-12T23:00:00Z",
      status: "Scheduled",
    },
    {
      id: "nhl-2",
      league: "nhl",
      away: "Oilers",
      home: "Canucks",
      startTime: "2024-10-12T02:00:00Z",
      status: "Live",
    },
    {
      id: "nhl-3",
      league: "nhl",
      away: "Bruins",
      home: "Devils",
      startTime: "2024-10-12T01:00:00Z",
      status: "Scheduled",
    },
  ],
  golf: [
    {
      id: "golf-1",
      league: "golf",
      away: "Rahm",
      home: "McIlroy",
      startTime: "2024-09-13T13:15:00Z",
      status: "Scheduled",
    },
    {
      id: "golf-2",
      league: "golf",
      away: "Scheffler",
      home: "Koepka",
      startTime: "2024-09-13T15:40:00Z",
      status: "Scheduled",
    },
    {
      id: "golf-3",
      league: "golf",
      away: "Homa",
      home: "Matsuyama",
      startTime: "2024-09-13T17:00:00Z",
      status: "Live",
    },
  ],
};

export const getCombinedSchedule = () =>
  Object.values(scheduleByLeague)
    .flat()
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

export const getLeagueSchedule = (league: LeagueKey) => scheduleByLeague[league];
