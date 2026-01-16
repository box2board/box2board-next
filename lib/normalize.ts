import type { Event, League } from '@/types';

export function normalizeMlbGame(game: any, league: League): Event {
  const status = game.status?.detailedState ?? 'Scheduled';
  const isLive = status === 'In Progress';
  const isFinal = status === 'Final' || status === 'Game Over';
  return {
    id: String(game.gamePk ?? game.gameGuid ?? game.gameId),
    league,
    startTime: game.gameDate,
    status,
    home: {
      name: game.teams?.home?.team?.name ?? 'Home',
      score: game.teams?.home?.score ?? null,
    },
    away: {
      name: game.teams?.away?.team?.name ?? 'Away',
      score: game.teams?.away?.score ?? null,
    },
    venue: game.venue?.name ?? null,
    isLive,
    isFinal,
  };
}

export function normalizeBdlGame(game: any, league: League): Event {
  const status = game.status ?? 'Scheduled';
  const isLive = status.toLowerCase().includes('in progress');
  const isFinal = status.toLowerCase().includes('final');
  return {
    id: String(game.id),
    league,
    startTime: game.date,
    status,
    home: {
      name: game.home_team?.full_name ?? game.home_team?.name ?? 'Home',
      score: game.home_team_score ?? null,
    },
    away: {
      name: game.visitor_team?.full_name ?? game.visitor_team?.name ?? 'Away',
      score: game.visitor_team_score ?? null,
    },
    venue: game.venue ?? null,
    isLive,
    isFinal,
  };
}
