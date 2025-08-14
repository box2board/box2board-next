import { fetchNbaPageData } from '@/lib/nba';

/**
 * NBA dashboard page. Shows the current odds for today’s games along
 * with the top scorers over the last five games. The top scorers
 * widget is kept small so it remains readable on mobile. Additional
 * statistics such as rebounds or assists can be added alongside
 * points by extending the Scorer interface and display logic.
 */
export default async function NbaPage() {
  const { odds, scorers } = await fetchNbaPageData();
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-2">NBA Odds</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Matchup</th>
                <th>Home ML / Spread</th>
                <th>Away ML</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {odds.map(o => (
                <tr key={o.gameId}>
                  <td>{o.awayTeam} @ {o.homeTeam}</td>
                  <td>{o.moneylineHome ?? '—'} {o.spread !== undefined ? ` / ${o.spread}` : ''}</td>
                  <td>{o.moneylineAway ?? '—'}</td>
                  <td>{o.total ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Top Scorers (Last 5 Games)</h2>
        <div className="overflow-x-auto max-w-md">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>Avg Pts</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map(s => (
                <tr key={s.playerName}>
                  <td>{s.playerName}</td>
                  <td>{s.team}</td>
                  <td>{s.avgPoints.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}