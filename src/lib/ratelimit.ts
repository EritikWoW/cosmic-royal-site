const hits = new Map<string, number[]>();

/** Simple in-memory sliding window limiter (per server instance). */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) { hits.set(key, arr); return false; }
  arr.push(now);
  hits.set(key, arr);
  return true;
}

export const clientIp = (h: Headers) => h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
