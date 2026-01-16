export type League = 'mlb' | 'nba' | 'nfl' | 'nhl' | 'golf';

export type EventParticipant = {
  name: string;
  score?: number | null;
};

export type Event = {
  id: string;
  league: League;
  startTime: string;
  status: string;
  home: EventParticipant;
  away: EventParticipant;
  venue?: string | null;
  isLive?: boolean;
  isFinal?: boolean;
};

export type TrendItem = {
  label: string;
  value: string;
  context: string;
  updatedAt: string;
};

export type TodayResponse = {
  ok: boolean;
  league: League;
  date: string;
  updatedAt: string;
  source: string;
  events: Event[];
  warnings?: string[];
};
