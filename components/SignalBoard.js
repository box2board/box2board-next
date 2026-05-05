const players = [
  ['Aaron Judge', 'HIGH'],
  ['Kyle Schwarber', 'HIGH'],
  ['Pete Alonso', 'MED'],
  ['Matt Olson', 'MED'],
  ['Adolis García', 'LOW'],
];

const hotGames = [
  ['Yankees vs Red Sox', 'HOT'],
  ['Braves vs Phillies', 'WARM'],
  ['Dodgers vs Padres', 'WARM'],
];

const avoidGames = [
  ['Tigers vs Royals', 'COLD'],
  ['A’s vs Mariners', 'COLD'],
];

function SignalRow({ name, signal }) {
  return (
    <div className="signal-row">
      <span>{name}</span>
      <span className={`pill ${signal.toLowerCase()}`}>{signal}</span>
    </div>
  );
}

function SignalSection({ title, rows }) {
  return (
    <section>
      <h3 className="section-label">{title}</h3>
      <div className="signal-list">
        {rows.map(([name, signal]) => (
          <SignalRow key={`${name}-${signal}`} name={name} signal={signal} />
        ))}
      </div>
    </section>
  );
}

export default function SignalBoard() {
  return (
    <div className="card board-grid">
      <SignalSection title="Players" rows={players} />
      <SignalSection title="Hot Games" rows={hotGames} />
      <SignalSection title="Avoid" rows={avoidGames} />
    </div>
  );
}
