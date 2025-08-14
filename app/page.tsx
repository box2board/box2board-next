/**
 * The home page of Box2Board. This page serves as a simple introduction
 * to the project and guides users towards one of the sport‑specific
 * dashboards. As more sports are added you can update this
 * description to reflect available features.
 */
export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold mb-2">Welcome to Box2Board</h1>
      <p>
        Box2Board provides lightweight betting insights across MLB, NFL and
        NBA. Data is refreshed automatically throughout the day via Vercel
        Cron and cached in Vercel KV. Click on one of the sports above to
        explore today’s matchups, trends and odds.
      </p>
    </section>
  );
}
