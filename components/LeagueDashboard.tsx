import type { League, TodayResponse, TrendItem } from '@/types';
import { leagueLabels } from '@/lib/leagues';
import { getBaseUrl } from '@/lib/server-fetch';
import EventsTable from '@/components/EventsTable';
import ErrorNotice from '@/components/ErrorNotice';

async function fetchToday(league: League): Promise<TodayResponse | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/today?league=${league}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as TodayResponse;
  } catch (error) {
    return null;
  }
}

async function fetchTrends(
  league: League
): Promise<{ items: TrendItem[]; updatedAt: string } | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/trends?league=${league}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as { items: TrendItem[]; updatedAt: string };
  } catch (error) {
    return null;
  }
}

type Props = {
  league: League;
};

export default async function LeagueDashboard({ league }: Props) {
  const [today, trends] = await Promise.all([
    fetchToday(league),
    fetchTrends(league),
  ]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-gray-300 uppercase tracking-wide">
          {leagueLabels[league]} Insights
        </p>
        <h1 className="text-3xl font-bold">{leagueLabels[league]}</h1>
      </div>

      {today ? (
        <>
          {today.warnings?.length ? (
            <div className="warning-box">
              {today.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          ) : null}
          <EventsTable events={today.events} updatedAt={today.updatedAt} />
        </>
      ) : (
        <ErrorNotice message="We could not load today's events." />
      )}

      <div className="card">
        <h2 className="text-lg font-semibold">Trends &amp; Streaks (Beta)</h2>
        <div className="trend-grid">
          {trends?.items?.length ? (
            trends.items.map((item) => (
              <div key={item.label} className="trend-card">
                <p className="font-semibold">{item.label}</p>
                {item.value ? <p className="trend-value">{item.value}</p> : null}
                <p className="text-gray-300">{item.context}</p>
              </div>
            ))
          ) : (
            <div className="trend-card">
              <p className="font-semibold">Coming soon</p>
              <p className="text-gray-300">
                Trend engine is being wired for real streak math.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
