import type { League } from '@/types';

export const leagues: League[] = ['mlb', 'nba', 'nfl', 'nhl', 'golf'];

export const leagueLabels: Record<League, string> = {
  mlb: 'MLB',
  nba: 'NBA',
  nfl: 'NFL',
  nhl: 'NHL',
  golf: 'Golf',
};

export const leagueDescriptions: Record<League, string> = {
  mlb: 'Today in MLB: schedules, scores, and status updates.',
  nba: 'Today in NBA: schedules, scores, and status updates.',
  nfl: 'Today in NFL: schedules, scores, and status updates.',
  nhl: 'Today in NHL: schedules, scores, and status updates.',
  golf: 'Today in Golf: tournament status and updates.',
};
