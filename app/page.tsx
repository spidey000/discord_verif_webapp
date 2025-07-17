import Link from 'next/link'
import { DiscordIcon, SolanaIcon } from '@/components/Icons'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Image 
              src="/sendit-text-logo.svg" 
              alt="Sendit Logo" 
              width={200} 
              height={50}
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sendit-primary to-sendit-secondary bg-clip-text text-transparent mb-4">
            Sendit Wallet Verification
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-2">
            Secure Discord Integration for Solana Wallets
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Link your Solana wallet to your Discord account and unlock exclusive community features
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card card-glow">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2 text-sendit-primary">Quick Verification</h3>
            <p className="text-gray-400">
              Complete wallet verification in under 60 seconds with our streamlined process
            </p>
          </div>
          
          <div className="card card-glow">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2 text-sendit-primary">Maximum Security</h3>
            <p className="text-gray-400">
              Sign a simple message to prove ownership - we never access your private keys
            </p>
          </div>
          
          <div className="card card-glow">
            <div className="text-3xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2 text-sendit-primary">Discord Benefits</h3>
            <p className="text-gray-400">
              Unlock exclusive roles, XP system, and community features in the Sendit Discord
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="card mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">How Verification Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">1</div>
              <div>
                <h4 className="font-semibold mb-1">Discord Command</h4>
                <p className="text-sm text-gray-400">Use /solana-verify in the Sendit Discord server</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">2</div>
              <div>
                <h4 className="font-semibold mb-1">Click Verification Link</h4>
                <p className="text-sm text-gray-400">Receive a secure verification link valid for 10 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">3</div>
              <div>
                <h4 className="font-semibold mb-1">Connect & Sign</h4>
                <p className="text-sm text-gray-400">Connect your wallet and sign the verification message</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="card border-sendit-primary/20 bg-sendit-primary/5">
          <div className="flex items-start gap-3 text-left">
            <div className="text-sendit-primary text-xl">🔒</div>
            <div>
              <h4 className="font-semibold text-sendit-primary mb-2">Security First</h4>
              <p className="text-sm text-gray-300">
                Your wallet remains secure throughout the verification process. We never request private keys or seed phrases. 
                You only sign a message to prove ownership - no transactions or approvals required.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <p className="text-gray-400 mb-6">
            Start verification from Discord to link your wallet!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://discord.gg/your-invite-link" 
              className="btn-primary inline-flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon className="w-5 h-5" />
              Join Sendit Discord
            </Link>
            <Link 
              href="#how-it-works" 
              className="btn-secondary"
            >
              Learn About Verification
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}