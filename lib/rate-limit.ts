type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const bucket = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = bucket.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    bucket.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
