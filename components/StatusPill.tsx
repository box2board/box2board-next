import type { Event } from '@/types';

type Props = {
  event: Event;
};

export default function StatusPill({ event }: Props) {
  const className = event.isLive
    ? 'pill pill-live'
    : event.isFinal
      ? 'pill pill-final'
      : 'pill pill-upcoming';

  return <span className={className}>{event.status}</span>;
}
