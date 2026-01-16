import { headers } from 'next/headers';

type HealthPayload = {
  ok: boolean;
  timestamp: string;
  build: string | null;
};

export const dynamic = 'force-dynamic';

async function fetchHealth(): Promise<HealthPayload> {
  const headerList = headers();
  const host = headerList.get('host') ?? 'localhost:3000';
  const protocol = headerList.get('x-forwarded-proto') ?? 'http';

  const response = await fetch(`${protocol}://${host}/api/health`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}

export default async function HealthPage() {
  const data = await fetchHealth();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Health Check</h1>
      <p className="text-gray-300">
        Live response from <code>/api/health</code>.
      </p>
      <pre className="code-block">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
