# Discord Wallet Verification App

A Next.js web application for verifying Solana wallet ownership for Discord bot users. This app provides a secure interface for users to connect their Solana wallets and sign verification messages.

## 🚀 Features

- **Multiple Wallet Support**: Supports Phantom, Solflare, Backpack, Glow, Slope, and Torus wallets
- **Secure Verification**: JWT-based verification with message signing
- **Responsive Design**: Beautiful, mobile-friendly interface with Discord theming
- **Real-time Status**: Live verification status updates and error handling
- **Security First**: No private key storage, client-side only message signing

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Discord/Solana theming
- **Wallet Integration**: Solana Wallet Adapter
- **Language**: TypeScript
- **Deployment**: Optimized for Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Discord bot with Solana verification API

## ⚙️ Installation

1. **Clone and navigate to webapp directory**:
```bash
cd webapp
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_BOT_API_URL=http://localhost:8080
```

4. **Start development server**:
```bash
npm run dev
# or
yarn dev
```

5. **Open browser**: Navigate to `http://localhost:3000`

## 🌐 Deployment on Vercel

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SOLANA_RPC_URL`: Your Solana RPC endpoint
   - `NEXT_PUBLIC_BOT_API_URL`: Your Discord bot API URL

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_BOT_API_URL` | Discord bot API URL | `https://your-bot-domain.com` |

### Supported Wallets

- **Phantom** - Most popular Solana wallet
- **Solflare** - Feature-rich browser and mobile wallet  
- **Backpack** - Modern wallet with built-in dApp browser
- **Glow** - Non-custodial wallet with staking features
- **Slope** - Mobile-first wallet experience
- **Torus** - Social login wallet

## 🛡️ Security Features

- **No Private Key Storage**: All signing happens client-side
- **JWT Verification**: Secure token validation with expiration
- **Message Signing**: Cryptographic proof of wallet ownership
- **Rate Limiting**: Protection against spam and abuse
- **HTTPS Only**: Secure communication in production
- **CSP Headers**: Content Security Policy for XSS protection

## 🎨 Customization

### Theming

The app uses a custom theme inspired by Discord and Solana branding:

```css
/* Discord Colors */
colors: {
  discord: {
    blurple: '#5865F2',
    green: '#57F287', 
    red: '#ED4245',
    dark: '#2C2F33',
    darker: '#23272A',
  },
  solana: {
    purple: '#9945FF',
    green: '#14F195',
  }
}
```

### Adding New Wallets

To add support for additional wallets:

1. Install the wallet adapter:
```bash
npm install @solana/wallet-adapter-[wallet-name]
```

2. Add to `components/WalletProvider.tsx`:
```tsx
import { NewWalletAdapter } from '@solana/wallet-adapter-[wallet-name]'

const wallets = useMemo(() => [
  // ... existing wallets
  new NewWalletAdapter(),
], [network])
```

## 📊 API Integration

The app communicates with your Discord bot's API:

### Verification Endpoint
```
POST /api/confirm
{
  "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "signature": "5uH3..."
}
```

### Health Check
```
GET /api/health
```

## 🔍 Troubleshooting

### Common Issues

**Wallet not connecting**:
- Ensure wallet extension is installed and unlocked
- Try refreshing the page
- Check browser console for errors

**Verification failing**:
- Verify bot API is running and accessible
- Check JWT token hasn't expired (10 minutes)
- Ensure correct API URL in environment variables

**Build errors**:
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm ci`
- Check Node.js version compatibility

### Debug Mode

Enable verbose logging:
```bash
DEBUG=* npm run dev
```

## 📁 Project Structure

```
webapp/
├── app/
│   ├── Confirm/          # Verification page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── Icons.tsx         # SVG icon components
│   └── WalletProvider.tsx # Wallet adapter setup
├── lib/
│   ├── api.ts           # API client functions
│   └── wallet.ts        # Wallet utility functions
├── utils/
│   └── jwt.ts           # JWT utility functions
├── public/              # Static assets
├── package.json         # Dependencies
└── README.md           # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is part of the dream_liquidity Discord bot ecosystem.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review browser console for error messages  
- Ensure all environment variables are correctly configured
- Verify Discord bot is running and API endpoint is accessible