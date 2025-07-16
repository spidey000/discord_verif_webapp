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
  title: 'Sendit - Solana Trading Platform',
  description: 'Trade Solana tokens with leverage on the fastest decentralized trading platform',
  keywords: ['Solana', 'Trading', 'DeFi', 'Leverage', 'Sendit', 'Web3'],
  authors: [{ name: 'Sendit Team' }],
  robots: 'noindex, nofollow', // Prevent search engine indexing for security
  openGraph: {
    title: 'Sendit - Solana Trading Platform',
    description: 'Trade Solana tokens with leverage on the fastest decentralized trading platform',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sendit Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sendit - Solana Trading Platform',
    description: 'Trade Solana tokens with leverage on the fastest decentralized trading platform',
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
          <div className="min-h-screen bg-gradient-to-br from-sendit-darker via-sendit-dark to-sendit-gray-900">
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}