import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Box2Board',
  description: 'Lightweight betting insights for MLB, NFL and NBA',
};

/**
 * Root layout for the application. Defines a simple dark theme and a
 * persistent navigation bar linking to each sport. The NavBar uses
 * Next.js' Link component for client‑side transitions without
 * requiring any heavy client code.
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
            <span className="text-gray-300">MLB</span>
            <span className="text-gray-300">NFL</span>
            <span className="text-gray-300">NBA</span>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
