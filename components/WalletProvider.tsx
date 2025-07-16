'use client'

import React, { useMemo } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css')

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Use mainnet for production, devnet for development
  const network = WalletAdapterNetwork.Mainnet
  
  // RPC endpoint - use environment variable or fallback to default
  const endpoint = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    return rpcUrl || clusterApiUrl(network)
  }, [network])

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      // Popular wallet adapters
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      // Note: Backpack, Glow, and other wallets that support the Wallet Standard
      // will be automatically detected without needing specific adapters
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}