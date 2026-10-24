import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCTION_URL } from "@/lib/site";

const siteUrl = PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Box2Board | Daily Sports Intelligence", template: "%s | Box2Board" },
  description: "Daily sports context, trends, matchup intelligence, schedules, and scores across major leagues.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Box2Board", title: "Box2Board | Know what matters", description: "Daily sports context, trends, matchup intelligence, and scores in one clear board.", url: "/" },
  twitter: { card: "summary_large_image", title: "Box2Board | Know what matters", description: "Daily sports context, trends, matchup intelligence, and scores in one clear board." },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0b0f14", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Box2Board", url: siteUrl, description: "Daily sports context, trends, matchup intelligence, schedules, and scores across major leagues." }) }} /><a className="skipLink" href="#main">Skip to content</a><Header /><main id="main" className="main-content">{children}</main><Footer /></body></html>;
}
