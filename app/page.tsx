import Link from 'next/link'
import { DiscordIcon, SolanaIcon } from '@/components/Icons'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        <div className="text-center">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-center items-center mb-4 sm:mb-6">
              <Image 
                src="/sendit-text-logo.svg" 
                alt="Sendit Logo" 
                width={200} 
                height={50}
                className="h-10 sm:h-12 md:h-16 w-auto"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sendit-primary to-sendit-secondary bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              Sendit Wallet Verification
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-2 sm:mb-3 px-2">
              Secure Discord Integration for Solana Wallets
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto px-4">
              Link your Solana wallet to your Discord account and unlock exclusive community features
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="card card-glow">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">⚡</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-sendit-primary">Quick Verification</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Complete wallet verification in under 60 seconds with our streamlined process
              </p>
            </div>
            
            <div className="card card-glow">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🔐</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-sendit-primary">Maximum Security</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Sign a simple message to prove ownership - we never access your private keys
              </p>
            </div>
            
            <div className="card card-glow sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">🎮</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-sendit-primary">Discord Benefits</h3>
              <p className="text-sm sm:text-base text-gray-400">
                Unlock exclusive roles, XP system, and community features in the Sendit Discord
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="card mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">How Verification Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">1</div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Discord Command</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Use /solana-verify in the Sendit Discord server</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">2</div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Click Verification Link</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Receive a secure verification link valid for 10 minutes</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">3</div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Connect & Sign</h4>
                  <p className="text-xs sm:text-sm text-gray-400">Connect your wallet and sign the verification message</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="card border-sendit-primary/20 bg-sendit-primary/5 mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="text-sendit-primary text-xl sm:text-2xl flex-shrink-0">🔒</div>
              <div>
                <h4 className="font-semibold text-sendit-primary mb-2 text-sm sm:text-base">Security First</h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  Your wallet remains secure throughout the verification process. We never request private keys or seed phrases. 
                  You only sign a message to prove ownership - no transactions or approvals required.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
              Start verification from Discord to link your wallet!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
              <Link 
                href="https://discord.gg/your-invite-link" 
                className="btn-primary inline-flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 w-full sm:w-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DiscordIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Join Sendit Discord
              </Link>
              <Link 
                href="#how-it-works" 
                className="btn-secondary text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 w-full sm:w-auto text-center"
              >
                Learn About Verification
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}