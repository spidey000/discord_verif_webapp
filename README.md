# Sendit Discord Wallet Verification App

A Next.js web application for verifying Solana wallet ownership for Sendit Discord bot users. This app provides a secure interface for users to connect their Solana wallets and sign verification messages.

**🌐 Live Application:** https://discord-verif-webapp.vercel.app/

**🤖 Discord Bot:** Sendit Bot (requires local server running on port 8080)

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

### Frontend (Already Deployed)

The frontend is already deployed at https://discord-verif-webapp.vercel.app/

### Backend (Local Development)

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
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. **Start Discord bot server** (must be running on port 8080):
```bash
# In your Discord bot directory
python main.py
```

5. **For local frontend development** (optional):
```bash
npm run dev
# Navigate to http://localhost:3000
```

## 🌐 Current Deployment Setup

### Frontend (Vercel)
- **URL**: https://discord-verif-webapp.vercel.app/
- **Environment**: Production
- **API Target**: http://localhost:8080 (local Discord bot)

### Backend (Local)
- **Discord Bot**: Running on localhost:8080
- **Environment**: Development
- **CORS**: Configured to allow https://discord-verif-webapp.vercel.app

### Environment Variables (Vercel Dashboard)
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_BOT_API_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### For Production Deployment
1. Deploy Discord bot API to production server
2. Update `NEXT_PUBLIC_BOT_API_URL` in Vercel to production URL
3. Update CORS configuration in Discord bot

## 🔧 Configuration

### Environment Variables

| Variable | Description | Current Value | Production Value |
|----------|-------------|---------------|------------------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_BOT_API_URL` | Discord bot API URL | `http://localhost:8080` | `https://your-production-api.com` |
| `NEXT_PUBLIC_API_URL` | Fallback API URL | `http://localhost:8080` | `https://your-production-api.com` |

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

### Current Setup
- **Frontend**: https://discord-verif-webapp.vercel.app/
- **Backend**: http://localhost:8080 (local Discord bot)
- **CORS**: Frontend domain allowed in bot configuration

### Verification Endpoint
```
POST http://localhost:8080/api/confirm
{
  "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "wallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "signature": "5uH3..."
}
```

### Health Check
```
GET http://localhost:8080/api/health
```

### Required Discord Bot Configuration
```python
# In your Discord bot's API server
CORS_ORIGINS = [
    "https://discord-verif-webapp.vercel.app",
    "http://localhost:3000"  # For local development
]
```

## 🔍 Troubleshooting

### Common Issues

**Wallet not connecting**:
- Ensure wallet extension is installed and unlocked
- Try refreshing the page
- Check browser console for errors

**Verification failing**:
- Ensure Discord bot is running on localhost:8080
- Check bot API is accessible: `curl http://localhost:8080/api/health`
- Verify JWT token hasn't expired (10 minutes)
- Check CORS configuration allows https://discord-verif-webapp.vercel.app
- Use debug info toggle on confirmation page for diagnostics

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

This project is part of the Sendit Discord bot ecosystem.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Use the debug info toggle on the confirmation page
- Review browser console for error messages  
- Ensure Discord bot is running on localhost:8080
- Verify CORS configuration allows the Vercel frontend
- Check that all environment variables are correctly configured

### Debug Information
The confirmation page includes a "Show Debug Info" button that displays:
- Current environment detection
- API URL being used
- Configuration validation status
- Any configuration errors

### Common Network Issues
- **CSP Violations**: Check browser console for Content Security Policy errors
- **CORS Errors**: Ensure Discord bot allows https://discord-verif-webapp.vercel.app
- **Connection Failures**: Verify Discord bot is running and accessible on port 8080