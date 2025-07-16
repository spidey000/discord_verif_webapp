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
            Sendit
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-2">
            Solana Trading Platform
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Trade Solana tokens with leverage on the fastest decentralized trading platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card card-glow">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2 text-sendit-primary">Lightning Fast</h3>
            <p className="text-gray-400">
              Execute trades in milliseconds with our high-performance trading engine
            </p>
          </div>
          
          <div className="card card-glow">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-sendit-primary">Leverage Trading</h3>
            <p className="text-gray-400">
              Trade with up to 3x leverage to maximize your trading potential
            </p>
          </div>
          
          <div className="card card-glow">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-sendit-primary">Secure & Trustless</h3>
            <p className="text-gray-400">
              Trade directly from your wallet with no custody risk
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="card mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">How Trading Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">1</div>
              <div>
                <h4 className="font-semibold mb-1">Connect Wallet</h4>
                <p className="text-sm text-gray-400">Connect your Solana wallet to start trading instantly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">2</div>
              <div>
                <h4 className="font-semibold mb-1">Choose Token</h4>
                <p className="text-sm text-gray-400">Select from hundreds of Solana tokens to trade</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-sendit-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-black">3</div>
              <div>
                <h4 className="font-semibold mb-1">Execute Trade</h4>
                <p className="text-sm text-gray-400">Set your leverage and execute your trade with one click</p>
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
                Your funds remain in your wallet at all times. We never request private keys or seed phrases. 
                All trades are executed directly through smart contracts for maximum security.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <p className="text-gray-400 mb-6">
            Ready to start trading? Connect your wallet and begin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary inline-flex items-center gap-2">
              <SolanaIcon className="w-5 h-5" />
              Connect Wallet
            </button>
            <Link 
              href="#how-to-trade" 
              className="btn-secondary"
            >
              Learn to Trade
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}