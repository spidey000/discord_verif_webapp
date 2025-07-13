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

const API_BASE_URL = process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:8080'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Submits wallet verification to the Discord bot
 * @param request - Verification request data
 * @returns Promise with verification result
 */
export async function verifyWallet(request: VerificationRequest): Promise<VerificationResponse> {
  try {
    console.log('Submitting verification to bot API...')
    
    const response = await apiClient.post('/api/confirm', {
      jwt: request.jwt,
      wallet: request.wallet,
      signature: request.signature
    })

    console.log('Verification response:', response.data)

    // Handle successful response
    if (response.data.status === 'success') {
      return {
        success: true,
        message: response.data.message
      }
    } else {
      return {
        success: false,
        error: response.data.message || 'Verification failed',
        details: response.data.details
      }
    }
  } catch (error: any) {
    console.error('Verification API error:', error)

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>
      
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
        // Request was made but no response received
        return {
          success: false,
          error: 'Connection failed',
          details: 'Unable to connect to the verification server. Please check your internet connection and try again.'
        }
      }
    }

    // Generic error fallback
    return {
      success: false,
      error: 'Verification failed',
      details: error.message || 'An unexpected error occurred during verification.'
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
    console.warn('Bot API health check failed:', error)
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