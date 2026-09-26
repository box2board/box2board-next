import Link from "next/link";
export default function Footer() {
  return <footer className="siteFooter"><div><Link className="footerBrand" href="/">Box2Board</Link><p>The daily sports intelligence desk.</p></div><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/about">About & contact</Link></nav><p className="legal">Scores, source data, and derived statistics are informational and may be delayed or corrected. Verify important details with official league sources.</p></footer>;
}
