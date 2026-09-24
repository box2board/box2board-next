export type DailyStory = {
  title: string;
  summary: string;
  whyItMatters?: string;
  league?: string;
};

export type DailyBriefing = {
  date: string;
  dek: string;
  topStories: DailyStory[];
  performances: DailyStory[];
  trends: DailyStory[];
  rosterWatch: DailyStory[];
  watchToday: DailyStory[];
  quickHits: DailyStory[];
};

export const dailyBriefings: DailyBriefing[] = [];

export function getDailyBriefing(date: string) {
  return dailyBriefings.find((briefing) => briefing.date === date);
}

export function getLatestDailyBriefing() {
  return [...dailyBriefings].sort((a, b) => b.date.localeCompare(a.date))[0];
}
