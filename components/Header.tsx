"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LeagueNav from "./LeagueNav";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container headerInner">
        <Link href="/" className="logo" aria-label="Box2Board home">
          <span className="logoMark">B2B</span>
          <span>Box2Board</span>
        </Link>
        <LeagueNav pathname={pathname} />
      </div>
    </header>
  );
}
