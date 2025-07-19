import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base'
import bs58 from 'bs58'

export interface SignMessageResult {
  signature: string
  message: string
}

/**
 * Signs a verification message using the connected Solana wallet
 * @param signMessage - The wallet's signMessage function
 * @param jwt - The JWT token containing verification details
 * @returns Promise with signature and message
 */
export async function signMessage(
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined,
  jwt: string
): Promise<SignMessageResult> {
  if (!signMessage) {
    throw new Error('Wallet does not support message signing')
  }

  try {
    // Parse JWT to extract UUID for message
    const jwtParts = jwt.split('.')
    if (jwtParts.length !== 3) {
      throw new Error('Invalid verification token: malformed JWT structure')
    }

    let payload: { UUID: string; user_id: number; exp: number; iat?: number }
    try {
      payload = JSON.parse(atob(jwtParts[1]))
    } catch {
      throw new Error('Invalid verification token: corrupted payload')
    }

    const { UUID: tokenUuid, user_id, exp } = payload

    // Validate required fields
    if (!tokenUuid || typeof tokenUuid !== 'string') {
      throw new Error('Invalid verification token: missing or invalid UUID')
    }
    if (!user_id || typeof user_id !== 'number') {
      throw new Error('Invalid verification token: missing or invalid user ID')
    }
    if (!exp || typeof exp !== 'number') {
      throw new Error('Invalid verification token: missing or invalid expiration')
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000)
    if (exp < currentTime) {
      throw new Error('Verification token has expired. Please request a new verification link.')
    }

    // Validate UUID format (basic check)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidPattern.test(tokenUuid)) {
      throw new Error('Invalid verification token: malformed UUID')
    }

    // Create the verification message that matches what the bot expects
    const message = `Confirming wallet ownership for request: ${tokenUuid}`
    const messageBytes = new TextEncoder().encode(message)

    // Sign the message
    const signatureUint8Array = await signMessage(messageBytes)
    const signature = bs58.encode(signatureUint8Array)

    return {
      signature,
      message
    }
  } catch (error: unknown) {
    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    if (errorMessage.includes('User rejected')) {
      throw new Error('Signature request was cancelled. Please try again and approve the signature request.')
    } else if (errorMessage.includes('not supported')) {
      throw new Error('Your wallet does not support message signing. Please try a different wallet.')
    } else {
      throw new Error(`Failed to sign verification message: ${errorMessage || 'Unknown error'}`)
    }
  }
}

/**
 * Validates a Solana wallet address format
 * @param address - The wallet address to validate
 * @returns boolean indicating if the address is valid
 */
export function validateSolanaAddress(address: string): boolean {
  try {
    const decoded = bs58.decode(address)
    return decoded.length === 32
  } catch {
    return false
  }
}

/**
 * Truncates a wallet address for display purposes
 * @param address - The full wallet address
 * @param chars - Number of characters to show on each end (default: 4)
 * @returns Truncated address string
 */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2) {
    return address
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Checks if the wallet supports message signing
 * @param signMessage - The wallet's signMessage function
 * @returns boolean indicating if message signing is supported
 */
export function supportsMessageSigning(signMessage: any): boolean {
  return typeof signMessage === 'function'
}