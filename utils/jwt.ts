/**
 * JWT utility functions for client-side token handling
 * Note: These are for basic validation only, not cryptographic verification
 */

export interface JWTPayload {
  user_id: number
  UUID: string
  exp: number
  iat?: number
}

/**
 * Decodes a JWT token (client-side only - no signature verification)
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = JSON.parse(atob(parts[1]))
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token to check
 * @returns True if expired, false if valid, null if invalid token
 */
export function isJWTExpired(token: string): boolean | null {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) {
    return null
  }

  const now = Math.floor(Date.now() / 1000)
  return payload.exp < now
}

/**
 * Gets the expiration date of a JWT token
 * @param token - The JWT token
 * @returns Date object or null if invalid
 */
export function getJWTExpiration(token: string): Date | null {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) {
    return null
  }

  return new Date(payload.exp * 1000)
}

/**
 * Gets the time remaining until JWT expiration
 * @param token - The JWT token
 * @returns Milliseconds until expiration, or null if invalid
 */
export function getJWTTimeRemaining(token: string): number | null {
  const expiration = getJWTExpiration(token)
  if (!expiration) {
    return null
  }

  const now = new Date().getTime()
  const remaining = expiration.getTime() - now
  return Math.max(0, remaining)
}

/**
 * Formats time remaining in a human-readable format
 * @param milliseconds - Time remaining in milliseconds
 * @returns Formatted string (e.g., "5m 30s")
 */
export function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) {
    return 'Expired'
  }

  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

/**
 * Validates JWT format without signature verification
 * @param token - The JWT token to validate
 * @returns True if format is valid, false otherwise
 */
export function isValidJWTFormat(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }

    // Try to decode header and payload
    JSON.parse(atob(parts[0]))
    JSON.parse(atob(parts[1]))
    
    return true
  } catch {
    return false
  }
}