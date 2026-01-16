import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    default: 'Box2Board',
    template: '%s | Box2Board',
  },
  description: 'Lightweight sports insights across MLB, NBA, NFL, NHL, and Golf.',
};

/**
 * Root layout for the application. Defines a simple dark theme and a
 * persistent navigation bar linking to each sport.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        <header className="bg-gray-800 text-gray-100 px-4 py-3 shadow-md">
          <nav className="container mx-auto flex items-center space-x-6">
            <Link href="/" className="font-bold text-lg">Box2Board</Link>
            <Link href="/mlb" className="hover:text-blue-400">MLB</Link>
            <Link href="/nba" className="hover:text-blue-400">NBA</Link>
            <Link href="/nfl" className="hover:text-blue-400">NFL</Link>
            <Link href="/nhl" className="hover:text-blue-400">NHL</Link>
            <Link href="/golf" className="hover:text-blue-400">Golf</Link>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="footer">
          <p>
            Box2Board provides stats and analysis for informational purposes.
            It does not provide betting picks.
          </p>
        </footer>
      </body>
    </html>
  );
}
