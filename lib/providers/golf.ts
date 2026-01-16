import type { Event } from '@/types';

export async function fetchGolfEvents(): Promise<{
  events: Event[];
  warnings: string[];
  source: string;
}> {
  return {
    events: [],
    warnings: ['Golf provider is not connected yet.'],
    source: 'Golf Stub',
  };
}
