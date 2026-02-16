// Simple in-memory rate limiter
// For production with multiple instances, use Redis

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (IP, email, etc.)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(identifier, {
      count: 1,
      resetAt: now + windowMs
    })
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs
    }
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetAt
    }
  }

  entry.count++
  return {
    success: true,
    remaining: limit - entry.count,
    reset: entry.resetAt
  }
}

/**
 * Get IP address from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fallback - not ideal but better than nothing
  return 'unknown'
}
