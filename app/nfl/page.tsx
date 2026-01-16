import type { Metadata } from 'next';
import LeagueDashboard from '@/components/LeagueDashboard';
import { leagueDescriptions } from '@/lib/leagues';

export const metadata: Metadata = {
  title: 'NFL',
  description: leagueDescriptions.nfl,
};

export default function NflPage() {
  return <LeagueDashboard league="nfl" />;
}
