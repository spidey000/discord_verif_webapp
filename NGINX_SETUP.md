# Enhanced Nginx Configuration for Sendit Bot (gg0099.space)

This document provides comprehensive instructions for setting up nginx as a secure reverse proxy for the Sendit Discord bot's wallet verification API on a VPS server. This configuration enhances the existing deployment guide with production-ready security features.

## Prerequisites

- AlmaLinux VPS server with root access
- Domain `gg0099.space` pointing to your VPS IP address
- SSL certificate (Let's Encrypt recommended)
- Python Discord bot running on port 8080 (with fallback ports 8081, 8082, etc.)

## System Requirements

- **OS**: AlmaLinux 8+ or AlmaLinux 9+ (RHEL-compatible)
- **RAM**: Minimum 1GB (2GB recommended)
- **Storage**: 10GB available space
- **Network**: Open ports 80, 443, and bot port (8080)

## Installation and Setup

### 1. Install Nginx (AlmaLinux)

```bash
# Update system packages
sudo dnf update -y

# Install EPEL repository (required for nginx and certbot)
sudo dnf install -y epel-release

# Install nginx
sudo dnf install -y nginx

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check nginx status
sudo systemctl status nginx
```

### 2. Install Certbot for SSL Certificates (AlmaLinux)

```bash
# Install certbot and nginx plugin
sudo dnf install -y certbot python3-certbot-nginx

# Obtain SSL certificate for gg0099.space
sudo certbot --nginx -d gg0099.space -d www.gg0099.space
```

### 3. Configure Firewall (AlmaLinux with firewalld)

```bash
# AlmaLinux uses firewalld by default
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow HTTP and HTTPS traffic
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh

# Reload firewall configuration
sudo firewall-cmd --reload

# Check firewall status
sudo firewall-cmd --list-all
```

## Nginx Configuration

### 4. Create the Enhanced Configuration File

Create the nginx configuration file that combines the existing deployment architecture with enhanced security:

```bash
sudo nano /etc/nginx/sites-available/gg0099.space
```

Add the following unified configuration:

```nginx
# Enhanced Sendit Bot Configuration with Security Features
# Combines existing deployment guide structure with production security

# Define upstream for bot's local API service (from existing deployment guide)
upstream bot_api {
    server 127.0.0.1:8080;
    # Future: Add failover servers here if needed
    # server 127.0.0.1:8081 backup;
}

# Rate limiting zones (enhanced security feature)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=health_limit:10m rate=30r/m;

# Server block to handle HTTP and redirect to HTTPS (from existing guide)
server {
    listen 80;
    server_name gg0099.space www.gg0099.space;

    # Route for LetsEncrypt certificate validation (preserve existing)
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other HTTP traffic to HTTPS (preserve existing)
    location / {
        return 301 https://$host$request_uri;
    }
}

# Enhanced HTTPS server block with security features
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gg0099.space www.gg0099.space;

    # SSL certificate paths (will be managed by Certbot - preserve existing)
    # ssl_certificate /etc/letsencrypt/live/gg0099.space/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/gg0099.space/privkey.pem;
    # include /etc/letsencrypt/options-ssl-nginx.conf;
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enhanced Security Headers (new addition)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Enhanced API endpoint with security and CORS (replaces simple proxy)
    location /api/ {
        # Rate limiting for API calls (new security feature)
        limit_req zone=api_limit burst=5 nodelay;
        
        # Proxy to bot using upstream block (preserve existing architecture)
        proxy_pass http://bot_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Enhanced timeouts for reliability (new addition)
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # CORS Headers for Vercel Frontend (critical for wallet verification)
        add_header 'Access-Control-Allow-Origin' 'https://discord-verif-webapp.vercel.app' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        
        # Handle CORS preflight requests (required for wallet verification)
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

    # Enhanced health check endpoint (new addition)
    location /api/health {
        limit_req zone=health_limit burst=10 nodelay;
        
        proxy_pass http://bot_api/api/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Optimized for health checks
        proxy_connect_timeout 5s;
        proxy_send_timeout 5s;
        proxy_read_timeout 5s;
        
        # Don't log health checks to reduce noise
        access_log off;
    }

    # Block access to sensitive files (security enhancement)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Future extensibility preserved from existing guide
    # You can add other services here as mentioned in the original deployment guide:
    # location /other-service/ {
    #     proxy_pass http://localhost:3001;
    # }
    
    # Optional: Basic API status endpoint (can be removed if not needed)
    location = / {
        return 200 '{"service": "Sendit Discord Bot API", "status": "online", "domain": "gg0099.space"}';
        add_header Content-Type application/json always;
    }

    # Enhanced error handling (new addition)
    error_page 502 503 504 /5xx.html;
    location = /5xx.html {
        return 503 '{"status": "error", "message": "Bot service temporarily unavailable", "timestamp": "$time_iso8601"}';
        add_header Content-Type application/json always;
    }

    # Enhanced logging (new addition)
    access_log /var/log/nginx/gg0099-access.log combined;
    error_log /var/log/nginx/gg0099-error.log warn;
}
```

### 5. Enable the Configuration (AlmaLinux)

```bash
# Enable the site (AlmaLinux nginx uses different structure)
sudo ln -s /etc/nginx/sites-available/gg0099.space /etc/nginx/sites-enabled/

# Create sites-enabled directory if it doesn't exist
sudo mkdir -p /etc/nginx/sites-enabled

# Update main nginx.conf to include sites-enabled directory
# Add this line to /etc/nginx/nginx.conf in the http block if not present:
echo "include /etc/nginx/sites-enabled/*;" | sudo tee -a /etc/nginx/nginx.conf

# Remove default nginx site configuration if present
sudo rm -f /etc/nginx/conf.d/default.conf

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Environment Variables for Frontend

Update your Vercel environment variables to point to gg0099.space:

```bash
NEXT_PUBLIC_BOT_API_URL=https://gg0099.space
NEXT_PUBLIC_API_URL=https://gg0099.space
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/sendit
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Discord Bot Configuration

Ensure your Discord bot has the following environment variables (as per existing deployment guide):

```bash
# Discord Bot Token (from existing deployment guide)
DISCORD_TEST_TOKEN=your_production_discord_bot_token_here

# Database connection (Supabase Transaction Pooler format)
DATABASE_URL=postgresql://postgres.bnpqjqzviwgpgidbxqdt:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres

# JWT Secret for token signing (generate using existing guide method)
JWT_SECRET=your_secure_jwt_secret_here_minimum_64_characters

# CORS allowed origins (updated for gg0099.space)
CORS_ORIGINS=https://discord-verif-webapp.vercel.app,https://gg0099.space

# Server configuration (from existing deployment guide)
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