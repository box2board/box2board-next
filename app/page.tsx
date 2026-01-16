import LeagueTabs from '@/components/LeagueTabs';

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm text-gray-300 uppercase tracking-wide">
          Box2Board Platform
        </p>
        <h1 className="text-3xl font-bold">Box2Board</h1>
        <p className="text-gray-300 max-w-md">
          Daily sports insights across MLB, NBA, NFL, NHL, and Golf. Built for
          context and momentum, never picks.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="status-badge">Status: Online</span>
        <a className="link" href="/health">
          View health check
        </a>
      </div>
      <LeagueTabs />
    </section>
  );
}
