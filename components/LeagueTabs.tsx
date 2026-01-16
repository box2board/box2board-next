'use client';

import { useEffect, useState } from 'react';
import type { League, TodayResponse } from '@/types';
import { leagueLabels, leagues } from '@/lib/leagues';
import EventsTable from '@/components/EventsTable';
import ErrorNotice from '@/components/ErrorNotice';

const defaultLeague: League = 'mlb';

type RequestState = {
  loading: boolean;
  data: TodayResponse | null;
  error: string | null;
};

export default function LeagueTabs() {
  const [activeLeague, setActiveLeague] = useState<League>(defaultLeague);
  const [state, setState] = useState<RequestState>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchLeague = async (league: League) => {
    setState({ loading: true, data: null, error: null });
    try {
      const response = await fetch(`/api/today?league=${league}`);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = (await response.json()) as TodayResponse;
      setState({ loading: false, data, error: null });
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error: 'We could not load today\'s events. Please try again.',
      });
    }
  };

  useEffect(() => {
    fetchLeague(activeLeague);
  }, [activeLeague]);

  const data = state.data;

  return (
    <section className="space-y-4">
      <div className="tabs">
        {leagues.map((league) => (
          <button
            key={league}
            type="button"
            className={`tab ${league === activeLeague ? 'tab-active' : ''}`}
            onClick={() => setActiveLeague(league)}
          >
            {leagueLabels[league]}
          </button>
        ))}
      </div>

      {state.loading ? (
        <div className="card">
          <p className="text-gray-300">Loading today&apos;s events...</p>
        </div>
      ) : null}

      {state.error ? (
        <ErrorNotice
          message={state.error}
          onRetry={() => fetchLeague(activeLeague)}
        />
      ) : null}

      {data ? (
        <>
          {data.warnings?.length ? (
            <div className="warning-box">
              {data.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          ) : null}
          <EventsTable events={data.events} updatedAt={data.updatedAt} />
        </>
      ) : null}
    </section>
  );
}
