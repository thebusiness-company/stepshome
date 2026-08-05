/**
 * In-memory rate limiter (serverless-safe for single-instance).
 * For multi-instance production, replace with Upstash Redis.
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.lastRefill > 60 * 60 * 1000) store.delete(key);
  }
}, 10 * 60 * 1000);

interface RateLimitConfig {
  /** Max requests in window */
  maxTokens: number;
  /** Window in milliseconds */
  windowMs: number;
  /** Identifier prefix */
  prefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${config.prefix}:${identifier}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.lastRefill >= config.windowMs) {
    // New window
    store.set(key, { tokens: config.maxTokens - 1, lastRefill: now });
    return { allowed: true, remaining: config.maxTokens - 1, retryAfterMs: 0 };
  }

  if (entry.tokens <= 0) {
    const retryAfterMs = config.windowMs - (now - entry.lastRefill);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  entry.tokens--;
  return { allowed: true, remaining: entry.tokens, retryAfterMs: 0 };
}

// ─── Presets ────────────────────────────────────────────────────

/** Login: 5 attempts per 15 minutes */
export function checkLoginLimit(ip: string): RateLimitResult {
  return checkRateLimit(ip, { maxTokens: 5, windowMs: 15 * 60 * 1000, prefix: 'login' });
}

/** Form submission: 5 per minute per IP */
export function checkFormLimit(ip: string): RateLimitResult {
  return checkRateLimit(ip, { maxTokens: 5, windowMs: 60 * 1000, prefix: 'form' });
}

/** Upload: 10 per hour */
export function checkUploadLimit(ip: string): RateLimitResult {
  return checkRateLimit(ip, { maxTokens: 50, windowMs: 60 * 60 * 1000, prefix: 'upload' });
}

/** Newsletter subscription: 10 requests per 15 minutes per IP + email */
export function checkNewsletterLimit(ip: string, email: string): RateLimitResult {
  const identifier = `${ip}:${email.toLowerCase()}`;
  return checkRateLimit(identifier, { maxTokens: 10, windowMs: 15 * 60 * 1000, prefix: 'newsletter' });
}


/** Get IP from request headers */
export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
