import { fetchNflPageData } from '@/lib/nfl';

/**
 * NFL dashboard page. Displays today’s games alongside current odds
 * and a simple weather note indicating whether each matchup is
 * outdoors or indoors. Data is gathered via server functions so
 * additional metrics can be layered on without rewriting the page.
 */
export default async function NflPage() {
  const { games, odds, weatherNotes } = await fetchNflPageData();
  // Create a lookup for odds by game id for quick access
  const oddsMap: Record<string, any> = {};
  for (const o of odds) {
    oddsMap[o.gameId] = o;
  }
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-2">NFL Odds & Schedule</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Matchup</th>
                <th>Kickoff</th>
                <th>Home ML / Spread</th>
                <th>Away ML</th>
                <th>Total</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => {
                const o = oddsMap[game.id] ?? {};
                return (
                  <tr key={game.id}>
                    <td>{game.awayTeam} @ {game.homeTeam}</td>
                    <td>{new Date(game.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</td>
                    <td>{o.moneylineHome ?? '—'} {o.spread !== undefined ? ` / ${o.spread}` : ''}</td>
                    <td>{o.moneylineAway ?? '—'}</td>
                    <td>{o.total ?? '—'}</td>
                    <td>{weatherNotes[game.id] ?? ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
