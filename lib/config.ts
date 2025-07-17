/**
 * Configuration utilities for the Sendit wallet verification app
 */

export interface AppConfig {
  apiBaseUrl: string
  solanaRpcUrl: string
  environment: 'development' | 'production'
  isProduction: boolean
  isDevelopment: boolean
}

/**
 * Gets the current application configuration
 */
export function getAppConfig(): AppConfig {
  const isProduction = process.env.NODE_ENV === 'production' || 
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
  
  const environment = isProduction ? 'production' : 'development'
  
  // Determine API base URL
  let apiBaseUrl: string
  if (process.env.NEXT_PUBLIC_BOT_API_URL) {
    apiBaseUrl = process.env.NEXT_PUBLIC_BOT_API_URL
  } else if (isProduction) {
    apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
  } else {
    apiBaseUrl = 'http://localhost:8080'
  }
  
  return {
    apiBaseUrl,
    solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    environment,
    isProduction,
    isDevelopment: !isProduction,
  }
}

/**
 * Validates the current configuration
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const config = getAppConfig()
  const errors: string[] = []
  
  // Check API URL
  if (!config.apiBaseUrl || config.apiBaseUrl === 'https://your-production-api.com') {
    errors.push('API base URL is not configured properly')
  }
  
  // Check for localhost in production
  if (config.isProduction && config.apiBaseUrl.includes('localhost')) {
    errors.push('Production environment is using localhost API URL')
  }
  
  // Check for missing environment variables
  if (config.isProduction && !process.env.NEXT_PUBLIC_BOT_API_URL && !process.env.NEXT_PUBLIC_API_URL) {
    errors.push('Missing production API URL environment variables')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Gets debug information about the current configuration
 */
export function getConfigDebugInfo() {
  const config = getAppConfig()
  const validation = validateConfig()
  
  return {
    config,
    validation,
    environmentVariables: {
      NEXT_PUBLIC_BOT_API_URL: process.env.NEXT_PUBLIC_BOT_API_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
    runtime: {
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    },
  }
}