import SignalBoard from '../components/SignalBoard';
import PricingCard from '../components/PricingCard';

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero">
        <p className="eyebrow">Daily MLB Signal Board</p>
        <h1>Today’s MLB Board. Built to scan in seconds.</h1>
        <p>
          Player signals, hot games, and avoid spots—ranked daily and
          simplified.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary">Join for $10/month</button>
          <button className="btn btn-secondary">View Today’s Board</button>
        </div>
      </section>

      <section className="product-preview">
        <SignalBoard />
      </section>

      <section>
        <PricingCard />
      </section>
    </div>
  );
}
