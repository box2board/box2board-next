import type { Metadata } from 'next';
import LeagueDashboard from '@/components/LeagueDashboard';
import { leagueDescriptions } from '@/lib/leagues';

export const metadata: Metadata = {
  title: 'Golf',
  description: leagueDescriptions.golf,
};

export default function GolfPage() {
  return <LeagueDashboard league="golf" />;
}
