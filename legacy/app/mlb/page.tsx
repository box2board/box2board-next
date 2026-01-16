import { hrRateToClass } from '@/lib/utils';

/**
 * MLB dashboard page. Renders three widgets: home run hit rates,
 * weather based HR boost and an odds snapshot. Data is fetched
 * server‑side from our own API routes which are backed by Vercel KV
 * caches. Should a network or API error occur the widgets will
 * gracefully degrade by displaying whatever data is available.
 */
export default async function MlbPage() {
  // Fetch all data in parallel. The API routes return JSON that is
  // already cached when cron jobs run, so repeated calls are cheap.
  const [hrRes, weatherRes, oddsRes] = await Promise.all([
    fetch('/api/mlb/hr-hitrates', { cache: 'no-store' }),
    fetch('/api/mlb/weather', { cache: 'no-store' }),
    fetch('/api/mlb/odds', { cache: 'no-store' }),
  ]);
  const hrRates = await hrRes.json();
  const weather = await weatherRes.json();
  const odds = await oddsRes.json();
  return (
    <div className="space-y-8">
      {/* Home Run Hit Rates */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Home Run Hit Rates (L5/L10/L20 + Season)</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Team</th>
                <th>L5</th>
                <th>L10</th>
                <th>L20</th>
                <th>Season HR</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(hrRates) && hrRates.map((p: any) => (
                <tr key={p.playerId}>
                  <td>{p.playerName}</td>
                  <td>{p.team}</td>
                  <td className={hrRateToClass(p.l5)}>{p.l5.toFixed(2)}</td>
                  <td className={hrRateToClass(p.l10)}>{p.l10.toFixed(2)}</td>
                  <td className={hrRateToClass(p.l20)}>{p.l20.toFixed(2)}</td>
                  <td>{p.seasonHr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Weather HR Boost */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Weather HR Boost</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Matchup</th>
                <th>Venue</th>
                <th>Temp (°F)</th>
                <th>Wind (mph)</th>
                <th>Boost</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(weather) && weather.map((w: any) => (
                <tr key={w.gameId}>
                  <td>{w.awayTeam} @ {w.homeTeam}</td>
                  <td>{w.venue ?? ''}</td>
                  <td>{w.temperature ?? '—'}</td>
                  <td>{w.windSpeed ?? '—'}</td>
                  <td>{w.boost !== undefined ? w.boost.toFixed(2) : '—'}</td>
                  <td>{w.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* Odds Snapshot */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Odds Snapshot</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Matchup</th>
                <th>Home ML</th>
                <th>Away ML</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(odds) && odds.map((o: any) => (
                <tr key={o.gameId}>
                  <td>{o.awayTeam} @ {o.homeTeam}</td>
                  <td>{o.moneylineHome ?? '—'}</td>
                  <td>{o.moneylineAway ?? '—'}</td>
                  <td>{o.total ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
