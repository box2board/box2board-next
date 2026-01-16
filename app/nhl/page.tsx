import type { Metadata } from 'next';
import LeagueDashboard from '@/components/LeagueDashboard';
import { leagueDescriptions } from '@/lib/leagues';

export const metadata: Metadata = {
  title: 'NHL',
  description: leagueDescriptions.nhl,
};

export default function NhlPage() {
  return <LeagueDashboard league="nhl" />;
}
