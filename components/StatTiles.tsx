import Card from "./Card";

interface StatTile {
  label: string;
  value: string;
  detail?: string;
}

interface StatTilesProps {
  tiles: StatTile[];
}

export default function StatTiles({ tiles }: StatTilesProps) {
  return (
    <div className="grid gridCols3">
      {tiles.map((tile) => (
        <Card key={tile.label}>
          <div className="statTile">
            <span className="statValue">{tile.value}</span>
            <span className="statLabel">{tile.label}</span>
            {tile.detail ? (
              <span className="statLabel">{tile.detail}</span>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
