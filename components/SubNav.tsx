"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LeagueKey } from "@/lib/types";

interface SubNavProps {
  league: LeagueKey;
}

const tabs = [
  { label: "Game Lines", path: "lines" },
  { label: "Game Props", path: "game-props" },
  { label: "Player Props", path: "player-props" },
];

export default function SubNav({ league }: SubNavProps) {
  const pathname = usePathname();

  return (
    <div className="subnav" aria-label="League sub navigation">
      {tabs.map((tab) => {
        const href = `/${league}/${tab.path}`;
        const isActive = pathname === href;
        return (
          <Link
            key={tab.path}
            className={`subnavLink ${isActive ? "subnavActive" : ""}`}
            href={href}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
