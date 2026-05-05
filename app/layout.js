import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Box2Board',
  description: 'Today’s MLB board in one clean view.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
