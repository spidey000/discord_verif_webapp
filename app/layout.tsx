import type { Metadata, Viewport } from 'next'
import './globals.css'
import './fonts.css'
import { WalletProvider } from '@/components/WalletProvider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Sendit - Discord Wallet Verification',
  description: 'Securely link your Solana wallet to Discord and unlock exclusive Sendit community features',
  keywords: ['Solana', 'Discord', 'Wallet', 'Verification', 'Sendit', 'Web3', 'Community'],
  authors: [{ name: 'Sendit Team' }],
  robots: 'noindex, nofollow', // Prevent search engine indexing for security
  openGraph: {
    title: 'Sendit - Discord Wallet Verification',
    description: 'Securely link your Solana wallet to Discord and unlock exclusive Sendit community features',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sendit Wallet Verification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sendit - Discord Wallet Verification',
    description: 'Securely link your Solana wallet to Discord and unlock exclusive Sendit community features',
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
      <body className="font-sendit overflow-x-hidden">
        <WalletProvider>
          <div className="min-h-screen w-full bg-gradient-to-br from-sendit-darker via-sendit-dark to-sendit-gray-900">
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}