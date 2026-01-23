import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Box2Board | Sports Insights Dashboard",
    template: "%s | Box2Board",
  },
  description:
    "Box2Board delivers a modern sports analytics dashboard for trends, slate context, and market movement insights.",
  metadataBase: new URL("https://box2board.vercel.app"),
  openGraph: {
    title: "Box2Board | Sports Insights Dashboard",
    description:
      "Daily sports dashboard for trends, streaks, and market context. Insights, not picks.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
