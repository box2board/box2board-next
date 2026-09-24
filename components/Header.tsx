import Link from "next/link";
import { publicLeagues } from "@/lib/leagues";

export default function Header() {
  return <header className="siteHeader"><div className="headerInner"><Link className="brand" href="/" aria-label="Box2Board home"><span className="brandIcon" aria-hidden="true"><i /><i /></span><span>BOX<span>2</span>BOARD</span></Link><nav className="primaryNav" aria-label="Primary navigation"><Link href="/">Scores</Link>{publicLeagues.map((league) => <Link key={league.key} href={league.path}>{league.label}</Link>)}<Link href="/about">About</Link></nav></div></header>;
}
