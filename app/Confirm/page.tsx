'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { signMessage } from '@/lib/wallet'
import { verifyWallet, getEnvironmentInfo } from '@/lib/api'
import { getConfigDebugInfo } from '@/lib/config'
import { DiscordIcon, SolanaIcon, CheckIcon, XIcon, LoadingIcon } from '@/components/Icons'
import { Suspense } from 'react'

type VerificationStatus = 'loading' | 'connect_wallet' | 'signing' | 'verifying' | 'success' | 'error'

interface VerificationError {
  message: string
  details?: string
}

function ConfirmationPageContent() {
  const searchParams = useSearchParams()
  const { publicKey, signMessage: walletSignMessage, connected, disconnect } = useWallet()
  
  const [status, setStatus] = useState<VerificationStatus>('loading')
  const [error, setError] = useState<VerificationError | null>(null)
  const [jwt, setJwt] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  // Parse JWT from URL parameters
  useEffect(() => {
    const jwtParam = searchParams.get('jwt')
    if (!jwtParam) {
      setError({ 
        message: 'Invalid verification link', 
        details: 'No verification token found in URL. Please request a new verification link from Discord.' 
      })
      setStatus('error')
      return
    }

    try {
      // Basic JWT validation - check if it's properly formatted
      const parts = jwtParam.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format')
      }

      // Decode and check expiration
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < now) {
        setIsExpired(true)
        setError({ 
          message: 'Verification link expired', 
          details: 'This verification link has expired. Please request a new one from Discord.' 
        })
        setStatus('error')
        return
      }

      setJwt(jwtParam)
      setStatus('connect_wallet')
    } catch (err) {
      setError({ 
        message: 'Invalid verification token', 
        details: 'The verification token is malformed. Please request a new verification link from Discord.' 
      })
      setStatus('error')
    }
  }, [searchParams])

  // Auto-verify when wallet connects
  useEffect(() => {
    if (connected && publicKey && jwt && status === 'connect_wallet') {
      handleVerification()
    }
  }, [connected, publicKey, jwt, status])

  const handleVerification = useCallback(async () => {
    if (!publicKey || !walletSignMessage || !jwt) {
      setError({ message: 'Wallet not properly connected' })
      setStatus('error')
      return
    }

    try {
      setStatus('signing')
      setError(null)

      // Sign the verification message
      const { signature, message } = await signMessage(walletSignMessage, jwt)
      
      setStatus('verifying')

      // Send verification to bot
      const result = await verifyWallet({
        jwt,
        wallet: publicKey.toBase58(),
        signature: signature
      })

      if (result.success) {
        setStatus('success')
      } else {
        setError({ 
          message: result.error || 'Verification failed', 
          details: result.details 
        })
        setStatus('error')
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      setError({ 
        message: 'Verification failed', 
        details: err.message || 'An unexpected error occurred during verification.' 
      })
      setStatus('error')
    }
  }, [publicKey, walletSignMessage, jwt])

  const handleRetry = () => {
    if (connected) {
      disconnect()
    }
    setError(null)
    setStatus('connect_wallet')
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
      case 'signing':
      case 'verifying':
        return <LoadingIcon className="w-16 h-16 text-discord-blurple animate-spin" />
      case 'success':
        return <CheckIcon className="w-16 h-16 text-green-400" />
      case 'error':
        return <XIcon className="w-16 h-16 text-red-400" />
      default:
        return <SolanaIcon className="w-16 h-16 text-solana-purple" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return {
          title: 'Loading verification...',
          subtitle: 'Please wait while we prepare your verification'
        }
      case 'connect_wallet':
        return {
          title: 'Connect Your Solana Wallet',
          subtitle: 'Choose your wallet to begin the verification process'
        }
      case 'signing':
        return {
          title: 'Sign Verification Message',
          subtitle: 'Please sign the message in your wallet to prove ownership'
        }
      case 'verifying':
        return {
          title: 'Verifying Wallet...',
          subtitle: 'Confirming your wallet ownership with Discord'
        }
      case 'success':
        return {
          title: 'Verification Successful! 🎉',
          subtitle: 'You can now close this page and return to Discord'
        }
      case 'error':
        return {
          title: error?.message || 'Verification Failed',
          subtitle: error?.details || 'Please try again or request a new verification link'
        }
      default:
        return {
          title: 'Wallet Verification',
          subtitle: 'Verify your Solana wallet for Discord'
        }
    }
  }

  const statusMessage = getStatusMessage()

  return (
    <main className="min-h-screen w-full overflow-x-hidden flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <DiscordIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-discord-blurple" />
            <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-discord-blurple to-solana-purple"></div>
            <SolanaIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-solana-purple" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Wallet Verification
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Sendit Discord Bot
          </p>
        </div>

        {/* Main Card */}
        <div className="card card-glow">
          {/* Status Icon */}
          <div className="text-center mb-4 sm:mb-6">
            {getStatusIcon()}
          </div>

          {/* Status Message */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-white leading-tight">
              {statusMessage.title}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {statusMessage.subtitle}
            </p>
          </div>

          {/* Action Area */}
          <div className="space-y-4">
            {status === 'connect_wallet' && (
              <div className="text-center">
                <WalletMultiButton className="!w-full !text-sm sm:!text-base !py-2 sm:!py-3" />
                <p className="text-xs text-gray-500 mt-3 px-2">
                  Supported wallets: Phantom, Solflare, Backpack, and more
                </p>
              </div>
            )}

            {status === 'signing' && (
              <div className="status-warning text-center">
                <p className="text-xs sm:text-sm px-2">
                  Check your wallet for a signature request and approve it to continue.
                </p>
              </div>
            )}

            {status === 'verifying' && (
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-xs sm:text-sm text-gray-400">
                  Confirming with Discord bot...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="status-success text-center">
                <p className="font-medium mb-2 text-sm sm:text-base">✅ Wallet Successfully Verified!</p>
                <p className="text-xs sm:text-sm opacity-90 px-2">
                  Your Discord account is now verified. You can close this page and return to Discord to start earning XP!
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="status-error">
                  <p className="font-medium mb-2 text-sm sm:text-base">❌ {error?.message}</p>
                  {error?.details && (
                    <p className="text-xs sm:text-sm opacity-90">{error.details}</p>
                  )}
                </div>
                
                {!isExpired && (
                  <button
                    onClick={handleRetry}
                    className="btn-primary w-full text-sm sm:text-base py-2 sm:py-3"
                  >
                    Try Again
                  </button>
                )}
                
                {isExpired && (
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-400 mb-3 px-2">
                      Please request a new verification link from Discord
                    </p>
                    <a 
                      href="https://discord.gg/your-invite-link" 
                      className="btn-primary inline-flex items-center justify-center gap-2 w-full text-sm sm:text-base py-2 sm:py-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DiscordIcon className="w-4 h-4" />
                      Return to Discord
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {status !== 'error' && (
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700">
              <div className="text-center">
                <p className="text-xs text-gray-500 px-2">
                  🔒 This verification only requires signing a message. 
                  We never ask for private keys or seed phrases.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info Toggle */}
        <div className="text-center mt-4 sm:mt-6">
          <button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
          >
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </button>
        </div>

        {/* Debug Information */}
        {showDebugInfo && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Debug Information</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div>
                <strong>Environment:</strong> {getEnvironmentInfo().nodeEnv || 'unknown'}
              </div>
              <div>
                <strong>API URL:</strong> {getEnvironmentInfo().apiBaseUrl}
              </div>
              <div>
                <strong>Hostname:</strong> {getEnvironmentInfo().hostname}
              </div>
              <div>
                <strong>Protocol:</strong> {getEnvironmentInfo().protocol}
              </div>
              <div>
                <strong>Config Valid:</strong> {getConfigDebugInfo().validation.isValid ? 'Yes' : 'No'}
              </div>
              {!getConfigDebugInfo().validation.isValid && (
                <div className="mt-2 p-2 bg-red-900/20 border border-red-700 rounded">
                  <div className="font-semibold text-red-400">Configuration Issues:</div>
                  <ul className="mt-1 space-y-1">
                    {getConfigDebugInfo().validation.errors.map((error, index) => (
                      <li key={index} className="text-red-300">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-6 sm:mt-8">
          <a 
            href="/" 
            className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIcon className="w-8 h-8 text-discord-blurple animate-spin" />
      </div>
    }>
      <ConfirmationPageContent />
    </Suspense>
  )
}