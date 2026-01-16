import type { Metadata } from 'next';
import LeagueDashboard from '@/components/LeagueDashboard';
import { leagueDescriptions } from '@/lib/leagues';

export const metadata: Metadata = {
  title: 'NBA',
  description: leagueDescriptions.nba,
};

export default function NbaPage() {
  return <LeagueDashboard league="nba" />;
}
