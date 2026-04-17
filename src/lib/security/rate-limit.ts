import "server-only";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

declare global {
  var __opportunityRadarRateLimits: Map<string, RateLimitRecord> | undefined;
}

function getStore() {
  if (!global.__opportunityRadarRateLimits) {
    global.__opportunityRadarRateLimits = new Map();
  }

  return global.__opportunityRadarRateLimits;
}

function cleanupExpiredEntries(store: Map<string, RateLimitRecord>, now: number) {
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const store = getStore();

  cleanupExpiredEntries(store, now);

  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return;
  }

  if (current.count >= limit) {
    throw new Error("RATE_LIMITED");
  }

  current.count += 1;
  store.set(key, current);
}

export function isRateLimitError(error: unknown) {
  return error instanceof Error && error.message === "RATE_LIMITED";
}
