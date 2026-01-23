"use client";

import Link from "next/link";
import { leagues } from "@/lib/leagues";

interface LeagueNavProps {
  pathname: string;
}

export default function LeagueNav({ pathname }: LeagueNavProps) {
  return (
    <nav className="nav" aria-label="Primary">
      <Link
        className={`navLink ${pathname === "/" ? "navLinkActive" : ""}`}
        href="/"
      >
        Home
      </Link>
      {leagues.map((league) => (
        <Link
          key={league.key}
          className={`navLink ${
            pathname.startsWith(league.path) ? "navLinkActive" : ""
          }`}
          href={league.path}
        >
          {league.label}
        </Link>
      ))}
    </nav>
  );
}
