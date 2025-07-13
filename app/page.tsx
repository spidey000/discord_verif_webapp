import Link from 'next/link'
import { DiscordIcon, SolanaIcon } from '@/components/Icons'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <DiscordIcon className="w-16 h-16 text-discord-blurple" />
            <div className="w-12 h-0.5 bg-gradient-to-r from-discord-blurple to-solana-purple"></div>
            <SolanaIcon className="w-16 h-16 text-solana-purple" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-discord-blurple to-solana-purple bg-clip-text text-transparent mb-4">
            dream_liquidity
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-2">
            Discord Wallet Verification
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect your Solana wallet to unlock premium Discord features, earn XP, and join our verified community
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card card-glow">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2 text-discord-blurple">Earn XP</h3>
            <p className="text-gray-400">
              Start earning experience points for messages and voice activity
            </p>
          </div>
          
          <div className="card card-glow">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2 text-solana-purple">Leaderboard</h3>
            <p className="text-gray-400">
              Compete with other members and climb the community rankings
            </p>
          </div>
          
          <div className="card card-glow">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-discord-green">Achievements</h3>
            <p className="text-gray-400">
              Unlock special achievements and rewards based on your activity
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="card mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">How Verification Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-discord-blurple rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold mb-1">Get Verification Link</h4>
                <p className="text-sm text-gray-400">Click the verification button in Discord to receive your secure link</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-solana-purple rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold mb-1">Connect Wallet</h4>
                <p className="text-sm text-gray-400">Connect your Solana wallet and sign a verification message</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-discord-green rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold mb-1">Get Verified</h4>
                <p className="text-sm text-gray-400">Return to Discord with your new verified status and premium features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="card border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-start gap-3 text-left">
            <div className="text-yellow-400 text-xl">🔒</div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">Security Notice</h4>
              <p className="text-sm text-gray-300">
                This verification process only requires signing a message with your wallet. 
                We never ask for your private keys or seed phrases. 
                Links expire after 10 minutes for your security.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <p className="text-gray-400 mb-6">
            Ready to verify your wallet? Get your verification link from Discord first!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="https://discord.gg/your-invite-link" 
              className="btn-primary inline-flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon className="w-5 h-5" />
              Join Discord Server
            </Link>
            <Link 
              href="#how-to-verify" 
              className="btn-secondary"
            >
              How to Verify
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}