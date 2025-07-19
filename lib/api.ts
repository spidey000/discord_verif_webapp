import axios, { AxiosError } from 'axios'

interface VerificationRequest {
  jwt: string
  wallet: string
  signature: string
}

interface VerificationResponse {
  success: boolean
  error?: string
  details?: string
  message?: string
}

// Environment-based API configuration
const getApiBaseUrl = (): string => {
  // Priority: Environment variable > Production fallback > Development fallback
  if (process.env.NEXT_PUBLIC_BOT_API_URL) {
    return process.env.NEXT_PUBLIC_BOT_API_URL
  }
  
  // Check if we're in production environment
  if (process.env.NODE_ENV === 'production' || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')) {
    // Production API URL - must be configured for production deployments
    const productionApiUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!productionApiUrl || productionApiUrl === 'https://your-production-api.com') {
      // In production, we should fail fast if API URL is not configured
      if (typeof window !== 'undefined') {
        // Client-side: show user-friendly error
        throw new Error('The verification system is not properly configured. Please contact support.')
      }
      // Server-side: log warning but continue (for build process)
      return 'https://api-not-configured.example.com'
    }
    
    return productionApiUrl
  }
  
  // Development fallback
  return 'http://localhost:8080'
}

let API_BASE_URL: string
try {
  API_BASE_URL = getApiBaseUrl()
} catch (error) {
  // If configuration fails, set a placeholder that will cause clear errors
  API_BASE_URL = 'https://api-not-configured.example.com'
}

/**
 * Gets environment information for debugging
 * @returns Object with environment details
 */
export function getEnvironmentInfo() {
  return {
    apiBaseUrl: API_BASE_URL,
    nodeEnv: process.env.NODE_ENV,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
    hasApiEnvVar: !!process.env.NEXT_PUBLIC_BOT_API_URL,
    hasProductionApiEnvVar: !!process.env.NEXT_PUBLIC_API_URL,
  }
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Add retry logic for network failures
  validateStatus: (status) => status < 500, // Don't throw for 4xx errors
})

/**
 * Submits wallet verification to the Discord bot
 * @param request - Verification request data
 * @returns Promise with verification result
 */
export async function verifyWallet(request: VerificationRequest): Promise<VerificationResponse> {
  try {
    // Validate request data
    if (!request.jwt || !request.wallet || !request.signature) {
      return {
        success: false,
        error: 'Invalid request data',
        details: 'Missing required verification parameters.'
      }
    }
    
    const response = await apiClient.post('/api/confirm', {
      jwt: request.jwt,
      wallet: request.wallet,
      signature: request.signature
    })

    // Handle API response based on status field
    if (response.data.status === 'success') {
      return {
        success: true,
        message: response.data.message
      }
    } else if (response.data.status === 'error') {
      return {
        success: false,
        error: response.data.message || 'Verification failed',
        details: response.data.details
      }
    } else {
      // Fallback for unexpected response format
      return {
        success: false,
        error: 'Unexpected response format',
        details: 'The server returned an unexpected response format.'
      }
    }
  } catch (error: unknown) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; details?: string; status?: string }>
      
      if (axiosError.response) {
        // Server responded with error status
        const { status, data } = axiosError.response
        
        switch (status) {
          case 400:
            return {
              success: false,
              error: data?.message || 'Invalid verification data',
              details: data?.details || 'Please check your verification link and try again.'
            }
          case 429:
            return {
              success: false,
              error: 'Rate limit exceeded',
              details: 'Too many verification attempts. Please wait a moment and try again.'
            }
          case 500:
            return {
              success: false,
              error: 'Server error',
              details: 'The verification server is experiencing issues. Please try again later.'
            }
          default:
            return {
              success: false,
              error: `Server error (${status})`,
              details: data?.message || 'An unexpected server error occurred.'
            }
        }
      } else if (axiosError.request) {
        // Request was made but no response received - likely network/CORS issue
        const isProductionError = API_BASE_URL.includes('localhost') && typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        
        if (isProductionError) {
          return {
            success: false,
            error: 'Configuration Error',
            details: 'The verification system is not properly configured for production. Please contact support.'
          }
        }
        
        return {
          success: false,
          error: 'Connection failed',
          details: 'Unable to connect to the verification server. Please check your internet connection and try again.'
        }
      }
    }

    // Generic error fallback
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: 'Verification failed',
      details: errorMessage || 'An unexpected error occurred during verification.'
    }
  }
}

/**
 * Checks if the bot API is reachable
 * @returns Promise indicating if the API is healthy
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get('/api/health', { timeout: 5000 })
    return response.data.status === 'healthy'
  } catch (error) {
    return false
  }
}

/**
 * Gets the API base URL for debugging
 * @returns The configured API base URL
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL
}