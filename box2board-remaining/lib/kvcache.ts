/**
 * Simple helper for interacting with Vercel KV via its REST API. All
 * values are JSON serialised and deserialised automatically. If the
 * required environment variables are missing the functions return
 * undefined or null so that consumers can decide to use mock data.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

/**
 * Fetch a value from KV by key. Returns null if not found or if
 * configuration is missing.
 */
export async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) {
    return null;
  }
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
      },
      // Use the edge runtime if available – fetch is already polyfilled
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data === null || data?.result === undefined) return null;
    // Value is stored as a string in the result
    const value = data.result?.value ?? data?.value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        // Fallback to raw string
        return value as unknown as T;
      }
    }
    return value as T;
  } catch (err) {
    console.error('kvGet error', err);
    return null;
  }
}

/**
 * Set a value in KV with an optional TTL (in seconds). If TTL is
 * provided the entry will expire automatically. If no TTL is given
 * the entry will persist indefinitely.
 */
export async function kvSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return;
  try {
    const body: Record<string, any> = {
      value: JSON.stringify(value),
    };
    if (ttlSeconds && ttlSeconds > 0) {
      body.expirationTtl = ttlSeconds;
    }
    await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('kvSet error', err);
  }
}

/**
 * Get a cached value or execute a fetcher to produce one. The result is
 * cached with the provided TTL. If no TTL is provided the value will
 * persist indefinitely. This helper simplifies the common pattern of
 * reading from KV first then updating it if absent.
 */
export async function kvGetOrSet<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await kvGet<T>(key);
  if (cached !== null) return cached;
  const fresh = await fetcher();
  if (fresh !== null && fresh !== undefined) {
    await kvSet(key, fresh, ttlSeconds);
  }
  return fresh;
}