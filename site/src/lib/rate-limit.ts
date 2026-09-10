import "server-only";

/**
 * In-process fixed-window rate limiter for the public forms (spec §5).
 *
 * Deliberately simple and deliberately local: it holds off casual abuse from a
 * single connection on a single instance. It is not a shared limiter, so Stage 3
 * replaces it with one backed by the same store as the rest of the app before
 * the site runs on more than one instance.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Keeps the map from growing without bound on a long-lived process. */
function sweep(now: number): void {
  if (windows.size < 512) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, retryAfterSec: 0 };
  }

  existing.count += 1;
  const retryAfterSec = Math.max(
    1,
    Math.ceil((existing.resetAt - now) / 1000),
  );

  return {
    allowed: existing.count <= max,
    remaining: Math.max(max - existing.count, 0),
    retryAfterSec,
  };
}
