import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Discord Wallet Verification | dream_liquidity',
  description: 'Verify your Solana wallet to access premium Discord features and earn XP',
  keywords: ['Solana', 'Discord', 'Wallet', 'Verification', 'dream_liquidity', 'Web3'],
  authors: [{ name: 'dream_liquidity Team' }],
  robots: 'noindex, nofollow', // Prevent search engine indexing for security
  openGraph: {
    title: 'Discord Wallet Verification | dream_liquidity',
    description: 'Verify your Solana wallet to access premium Discord features',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'dream_liquidity Discord Verification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discord Wallet Verification | dream_liquidity',
    description: 'Verify your Solana wallet to access premium Discord features',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-gradient-to-br from-discord-darker via-discord-dark to-gray-900">
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}