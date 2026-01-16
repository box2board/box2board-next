export default function Home() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm text-gray-300 uppercase tracking-wide">
          Box2Board Platform
        </p>
        <h1 className="text-3xl font-bold">Box2Board</h1>
        <p className="text-gray-300 max-w-md">
          A lightweight, deployable Next.js foundation for sports data
          dashboards. This is a minimal landing page while the core product
          stabilizes.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="status-badge">Status: Online</span>
        <a className="link" href="/health">
          View health check
        </a>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold">Navigation</h2>
        <p className="text-gray-300">
          Placeholder sections for MLB, NFL, and NBA dashboards.
        </p>
      </div>
    </section>
  );
}
