export type FetchOptions = {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  headers?: Record<string, string>;
};

export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; ok: boolean; status: number; error?: string }> {
  const {
    timeoutMs = 8000,
    retries = 1,
    retryDelayMs = 300,
    headers = {},
  } = options;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return {
          data: null,
          ok: false,
          status: response.status,
          error: `Request failed with status ${response.status}`,
        };
      }

      try {
        const data = (await response.json()) as T;
        return { data, ok: true, status: response.status };
      } catch (error) {
        return {
          data: null,
          ok: false,
          status: response.status,
          error: 'Failed to parse JSON response',
        };
      }
    } catch (error) {
      clearTimeout(timeout);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        continue;
      }
      return {
        data: null,
        ok: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  return { data: null, ok: false, status: 0, error: 'Unknown error' };
}
