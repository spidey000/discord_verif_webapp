# Nginx Configuration for Sendit Bot Wallet Verification System

This document provides comprehensive instructions for setting up nginx as a reverse proxy for the Sendit Discord bot's wallet verification API on a VPS server.

## Prerequisites

- Ubuntu/Debian VPS server with root access
- Domain name pointing to your VPS IP address
- SSL certificate (Let's Encrypt recommended)
- Python Discord bot running on port 8080 (with fallback ports 8081, 8082, etc.)

## System Requirements

- **OS**: Ubuntu 20.04+ or Debian 11+
- **RAM**: Minimum 1GB (2GB recommended)
- **Storage**: 10GB available space
- **Network**: Open ports 80, 443, and bot port (8080)

## Installation and Setup

### 1. Install Nginx

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install nginx
sudo apt install nginx -y

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check nginx status
sudo systemctl status nginx
```

### 2. Install Certbot for SSL Certificates

```bash
# Install certbot and nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate (replace your-domain.com with your actual domain)
sudo certbot --nginx -d your-domain.com
```

### 3. Configure Firewall

```bash
# Allow nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# Check firewall status
sudo ufw status
```

## Nginx Configuration

### 4. Create the Main Configuration File

Create the nginx configuration file for your domain:

```bash
sudo nano /etc/nginx/sites-available/sendit-verification
```

Add the following configuration:

```nginx
# Sendit Bot Wallet Verification API Configuration
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=health_limit:10m rate=30r/m;

    # Bot API Endpoints
    location /api/ {
        # Rate limiting for API calls
        limit_req zone=api_limit burst=5 nodelay;
        
        # Proxy to Discord bot
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # CORS Headers for Frontend
        add_header 'Access-Control-Allow-Origin' 'https://discord-verif-webapp.vercel.app' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://discord-verif-webapp.vercel.app' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Health Check Endpoint (with separate rate limiting)
    location /api/health {
        limit_req zone=health_limit burst=10 nodelay;
        
        proxy_pass http://127.0.0.1:8080/api/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Shorter timeout for health checks
        proxy_connect_timeout 5s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
        
        # Don't log health checks
        access_log off;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Root location for basic info
    location / {
        return 200 '{"service": "Sendit Discord Bot API", "status": "online", "version": "2.0"}';
        add_header Content-Type application/json;
    }

    # Custom error pages
    error_page 502 503 504 /5xx.html;
    location = /5xx.html {
        return 503 '{"status": "error", "message": "Service temporarily unavailable"}';
        add_header Content-Type application/json;
    }

    # Logging
    access_log /var/log/nginx/sendit-verification.access.log;
    error_log /var/log/nginx/sendit-verification.error.log;
}
```

### 5. Enable the Configuration

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/sendit-verification /etc/nginx/sites-enabled/

# Remove default nginx site if present
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Environment Variables for Frontend

Update your Vercel environment variables to point to your domain:

```bash
NEXT_PUBLIC_BOT_API_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-invite-code
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Discord Bot Configuration

Ensure your Discord bot has the following environment variables:

```bash
# JWT Secret for token signing
JWT_SECRET=your-secure-jwt-secret-here

# Database connection
DATABASE_URL=postgresql://username:password@localhost/database_name

# CORS allowed origins
CORS_ORIGINS=https://discord-verif-webapp.vercel.app,https://your-domain.com

# Server configuration
HOST=127.0.0.1
PORT=8080
```

## Monitoring and Maintenance

### Log File Locations

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/sendit-verification.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/sendit-verification.error.log

# System logs
sudo journalctl -u nginx -f
```

### Health Check Commands

```bash
# Check nginx status
sudo systemctl status nginx

# Test API health
curl -s https://your-domain.com/api/health | jq

# Check SSL certificate expiry
sudo certbot certificates

# Test API endpoint
curl -X POST https://your-domain.com/api/confirm \
  -H "Content-Type: application/json" \
  -d '{"jwt":"test","wallet":"test","signature":"test"}'
```

### SSL Certificate Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Set up automatic renewal (should already be configured)
sudo systemctl status certbot.timer
```

## Security Considerations

### 1. Firewall Configuration

```bash
# Only allow necessary ports
sudo ufw reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 2. Additional Security Headers

The configuration includes essential security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-XSS-Protection` - Enables XSS protection
- `Strict-Transport-Security` - Forces HTTPS
- `Referrer-Policy` - Controls referrer information

### 3. Rate Limiting

- API endpoints: 10 requests/minute per IP
- Health checks: 30 requests/minute per IP
- Burst allowance for legitimate traffic spikes

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   ```bash
   # Check if bot is running
   sudo netstat -tlnp | grep :8080
   
   # Check bot logs
   sudo journalctl -u your-bot-service -f
   ```

2. **CORS Errors**
   ```bash
   # Test CORS headers
   curl -H "Origin: https://discord-verif-webapp.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS https://your-domain.com/api/confirm -v
   ```

3. **SSL Issues**
   ```bash
   # Check SSL configuration
   sudo nginx -t
   
   # Renew SSL certificate
   sudo certbot renew
   ```

### Performance Optimization

1. **Enable Gzip Compression**
   ```nginx
   # Add to http block in /etc/nginx/nginx.conf
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types application/json text/plain text/css application/javascript;
   ```

2. **Optimize Worker Processes**
   ```nginx
   # In /etc/nginx/nginx.conf
   worker_processes auto;
   worker_connections 1024;
   ```

## Testing the Setup

### 1. Basic Connectivity Test
```bash
# Test domain resolution
nslookup your-domain.com

# Test HTTP redirect
curl -I http://your-domain.com

# Test HTTPS
curl -I https://your-domain.com
```

### 2. API Endpoint Tests
```bash
# Health check
curl https://your-domain.com/api/health

# CORS preflight
curl -X OPTIONS https://your-domain.com/api/confirm \
  -H "Origin: https://discord-verif-webapp.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### 3. Frontend Integration Test
1. Deploy the frontend with updated environment variables
2. Generate a verification link in Discord
3. Test the complete verification flow
4. Monitor nginx logs for any errors

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Check SSL certificate expiry
   - Review nginx error logs
   - Monitor disk space

2. **Monthly**
   - Update system packages
   - Review access logs for unusual patterns
   - Backup nginx configuration

3. **As Needed**
   - Update CORS origins if frontend domain changes
   - Adjust rate limiting based on usage patterns
   - Scale server resources if needed

### Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review nginx error logs
3. Verify Discord bot is running and accessible
4. Test API endpoints individually
5. Contact the development team with specific error messages

---

**Note**: Replace `your-domain.com` with your actual domain name throughout this configuration.