type RedisResponse<T> = { result?: T; error?: string };
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

async function command<T>(path: string): Promise<T | null> {
  if (!url || !token) return null;
  const response = await fetch(`${url}/${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json() as RedisResponse<T>).result ?? null;
}
export async function getCache<T>(key: string) { const data = await command<string>(`get/${encodeURIComponent(key)}`); try { return data ? JSON.parse(data) as T : null; } catch { return null; } }
export async function setCache(key: string, value: unknown, ttlSeconds: number) { return command(`set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}/EX/${ttlSeconds}`); }
export async function checkRateLimit(key: string, limit = 10) { const count = await command<number>(`incr/${encodeURIComponent(key)}`); if (count === 1) await command(`expire/${encodeURIComponent(key)}/60`); return count === null || count <= limit; }
