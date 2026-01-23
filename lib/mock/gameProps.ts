import type { GameProp, LeagueKey } from "../types";

export const gamePropsByLeague: Record<LeagueKey, GameProp[]> = {
  mlb: [
    {
      id: "mlb-prop-1",
      label: "Team Total Runs",
      description: "Dodgers team total 4.5 runs",
      price: "Over -115 / Under -105",
      trend: "Over hit in 6 of last 8",
    },
    {
      id: "mlb-prop-2",
      label: "1st Inning Run",
      description: "Yankees/Red Sox NRFI",
      price: "Yes +105 / No -125",
      trend: "NRFI streak 3 straight",
    },
    {
      id: "mlb-prop-3",
      label: "Hits + Errors",
      description: "Cubs/Cardinals 16.5",
      price: "Over -110 / Under -110",
      trend: "Even split past 10",
    },
  ],
  nba: [
    {
      id: "nba-prop-1",
      label: "1Q Total",
      description: "Warriors/Lakers 58.5",
      price: "Over -108 / Under -112",
      trend: "1Q pace trending high",
    },
    {
      id: "nba-prop-2",
      label: "Team Total Points",
      description: "Celtics 114.5",
      price: "Over -115 / Under -105",
      trend: "Celtics scored 115+ in 4 of 5",
    },
    {
      id: "nba-prop-3",
      label: "First to 10",
      description: "Nuggets to 10 points",
      price: "+125",
      trend: "Fast-start trend",
    },
  ],
  nfl: [
    {
      id: "nfl-prop-1",
      label: "1H Total",
      description: "Chiefs/Bills 23.5",
      price: "Over -110 / Under -110",
      trend: "First halves trending up",
    },
    {
      id: "nfl-prop-2",
      label: "Team Total TDs",
      description: "Cowboys 2.5",
      price: "Over +115 / Under -135",
      trend: "Dallas red zone rate 68%",
    },
    {
      id: "nfl-prop-3",
      label: "Longest TD",
      description: "Ravens 39.5",
      price: "Over -105 / Under -115",
      trend: "Explosive plays trending",
    },
  ],
  nhl: [
    {
      id: "nhl-prop-1",
      label: "1P Total",
      description: "Rangers/Leafs 1.5",
      price: "Over -120 / Under +100",
      trend: "High first periods",
    },
    {
      id: "nhl-prop-2",
      label: "Team Total Goals",
      description: "Oilers 3.5",
      price: "Over -105 / Under -115",
      trend: "Edmonton shot volume up",
    },
    {
      id: "nhl-prop-3",
      label: "Power Play Goal",
      description: "Bruins to score PP goal",
      price: "+135",
      trend: "Power play efficiency 29%",
    },
  ],
  golf: [
    {
      id: "golf-prop-1",
      label: "Round Leader",
      description: "Round 1 leader market",
      price: "Top 10 odds",
      trend: "Early scoring expected",
    },
    {
      id: "golf-prop-2",
      label: "Birdies or Better",
      description: "McIlroy 14.5",
      price: "Over -110 / Under -110",
      trend: "Birdie rate trending up",
    },
    {
      id: "golf-prop-3",
      label: "Top 20 Finish",
      description: "Scheffler",
      price: "-175",
      trend: "Consistent top 20s",
    },
  ],
};

export const getLeagueGameProps = (league: LeagueKey) => gamePropsByLeague[league];
