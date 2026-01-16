import type { Event } from '@/types';
import { formatTorontoTime } from '@/lib/date';
import StatusPill from '@/components/StatusPill';

type Props = {
  events: Event[];
  updatedAt?: string;
};

export default function EventsTable({ events, updatedAt }: Props) {
  if (!events.length) {
    return (
      <div className="empty-state">
        <p className="text-gray-300">No events scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-header">
        <h3 className="text-lg font-semibold">Today&apos;s Events</h3>
        {updatedAt ? (
          <span className="text-sm text-gray-300">
            Last updated {formatTorontoTime(updatedAt)} ET
          </span>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Start (ET)</th>
              <th>Away</th>
              <th>Home</th>
              <th>Status</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{formatTorontoTime(event.startTime)}</td>
                <td>{event.away.name}</td>
                <td>{event.home.name}</td>
                <td>
                  <StatusPill event={event} />
                </td>
                <td>
                  {event.away.score ?? '—'} - {event.home.score ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
