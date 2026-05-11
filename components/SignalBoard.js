const players = [
  ['Aaron Judge', 'Power matchup', 'HIGH'],
  ['Kyle Schwarber', 'Favorable park spot', 'HIGH'],
  ['Pete Alonso', 'Trending bat', 'MED'],
  ['Matt Olson', 'Strong contact profile', 'MED'],
  ['Adolis García', 'Watchlist signal', 'LOW'],
];

const hotGames = [
  ['Yankees vs Red Sox', 'Best run environment', 'HOT'],
  ['Braves vs Phillies', 'Warm offensive setup', 'WARM'],
  ['Dodgers vs Padres', 'Lineup strength', 'WARM'],
];

const avoidGames = [
  ['Tigers vs Royals', 'Cold offensive profile', 'COLD'],
  ['A’s vs Mariners', 'Low-scoring setup', 'COLD'],
];

function SignalRow({ name, note, signal }) {
  return (
    <div className="signal-row">
      <div className="signal-copy">
        <span className="signal-name">{name}</span>
        <span className="signal-note">{note}</span>
      </div>
      <span className={`pill ${signal.toLowerCase()}`}>{signal}</span>
    </div>
  );
}

function SignalSection({ title, rows }) {
  return (
    <section className="signal-section">
      <h3 className="section-label">{title}</h3>
      <div className="signal-list">
        {rows.map(([name, note, signal]) => (
          <SignalRow
            key={`${name}-${signal}`}
            name={name}
            note={note}
            signal={signal}
          />
        ))}
      </div>
    </section>
  );
}

export default function SignalBoard() {
  return (
    <div className="card board-card board-grid">
      <SignalSection title="Players" rows={players} />
      <SignalSection title="Hot Games" rows={hotGames} />
      <SignalSection title="Avoid" rows={avoidGames} />
    </div>
  );
}
