import Link from "next/link";
export default function Footer() {
  return <footer className="siteFooter"><div><Link className="footerBrand" href="/">Box2Board</Link><p>A clear view of the day in sports.</p></div><nav aria-label="Footer navigation"><Link href="/">Scores</Link><Link href="/about">About & contact</Link></nav><p className="legal">Scores are informational and may be delayed. Verify important details with the official league.</p></footer>;
}
