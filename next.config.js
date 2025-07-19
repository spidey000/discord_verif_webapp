/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    NEXT_PUBLIC_BOT_API_URL: process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:8080',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com',
  },
  async headers() {
    // Get API URL for CSP configuration
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
    const botApiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:8080'
    
    // Build CSP policy
    const cspPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      // Allow connections to Solana RPCs and API endpoints
      `connect-src 'self' ${apiUrl} ${botApiUrl} https://gg0099.space https://*.solana.com https://*.projectserum.com https://*.ankr.com wss://*.solana.com https://api.mainnet-beta.solana.com https://solana-api.projectserum.com https://rpc.ankr.com`,
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspPolicy,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig