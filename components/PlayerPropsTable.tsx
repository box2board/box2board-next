"use client";

import { useState } from "react";
import type { PlayerProp } from "@/lib/types";

interface PlayerPropsTableProps {
  data: PlayerProp[];
}

type SortKey = "player" | "team" | "stat" | "line";

type SortState = {
  key: SortKey;
  direction: "asc" | "desc";
};

export default function PlayerPropsTable({ data }: PlayerPropsTableProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "player", direction: "asc" });

  const lower = query.toLowerCase();
  const filtered = data.filter((item) =>
    [item.player, item.team, item.stat, item.odds]
      .join(" ")
      .toLowerCase()
      .includes(lower)
  );

  const sorted = [...filtered].sort((a, b) => {
    const direction = sort.direction === "asc" ? 1 : -1;
    if (sort.key === "line") {
      return (a.line - b.line) * direction;
    }
    return a[sort.key].localeCompare(b[sort.key]) * direction;
  });

  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="grid" style={{ gap: "16px" }}>
      <input
        className="searchInput"
        placeholder="Search player, team, or stat"
        value={query}
        onChange={(event: { target: HTMLInputElement }) =>
          setQuery(event.target.value)
        }
        aria-label="Search player props"
      />
      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className={`buttonGhost ${sort.key === "player" ? "buttonGhostActive" : ""}`}
                  onClick={() => toggleSort("player")}
                >
                  Player
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className={`buttonGhost ${sort.key === "team" ? "buttonGhostActive" : ""}`}
                  onClick={() => toggleSort("team")}
                >
                  Team
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className={`buttonGhost ${sort.key === "stat" ? "buttonGhostActive" : ""}`}
                  onClick={() => toggleSort("stat")}
                >
                  Stat
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className={`buttonGhost ${sort.key === "line" ? "buttonGhostActive" : ""}`}
                  onClick={() => toggleSort("line")}
                >
                  Line
                </button>
              </th>
              <th>Market</th>
              <th>Insight</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((prop) => (
              <tr key={prop.id}>
                <td>{prop.player}</td>
                <td>{prop.team}</td>
                <td>{prop.stat}</td>
                <td>{prop.line}</td>
                <td>{prop.odds}</td>
                <td>{prop.insight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
