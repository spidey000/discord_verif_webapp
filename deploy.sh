#!/bin/bash

# =============================================================================
# Discord Wallet Verification Webapp - Vercel Deployment Script
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="discord-wallet-verification"
DEFAULT_SOLANA_RPC="https://api.mainnet-beta.solana.com"

# =============================================================================
# Utility Functions
# =============================================================================

print_header() {
    echo -e "${BLUE}"
    echo "=================================="
    echo "$1"
    echo "=================================="
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 is not installed"
        return 1
    fi
    return 0
}

# =============================================================================
# Prerequisite Checks
# =============================================================================

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local missing_deps=0
    
    # Check Node.js
    if check_command node; then
        local node_version=$(node --version)
        print_success "Node.js installed: $node_version"
        
        # Check if Node.js version is >= 18
        local major_version=$(echo $node_version | sed 's/v\([0-9]*\).*/\1/')
        if [ "$major_version" -lt 18 ]; then
            print_warning "Node.js version should be >= 18. Current: $node_version"
        fi
    else
        print_error "Node.js is required. Install from https://nodejs.org/"
        missing_deps=1
    fi
    
    # Check npm
    if check_command npm; then
        local npm_version=$(npm --version)
        print_success "npm installed: $npm_version"
    else
        print_error "npm is required"
        missing_deps=1
    fi
    
    # Check git (optional but recommended)
    if check_command git; then
        print_success "Git installed"
    else
        print_warning "Git not found (optional, but recommended for version control)"
    fi
    
    if [ $missing_deps -eq 1 ]; then
        print_error "Please install missing dependencies and run again"
        exit 1
    fi
    
    print_success "All prerequisites met!"
}

# =============================================================================
# Environment Setup
# =============================================================================

setup_environment() {
    print_header "Setting Up Environment Variables"
    
    # Check if .env.local already exists
    if [ -f ".env.local" ]; then
        print_warning ".env.local already exists"
        read -p "Do you want to overwrite it? [y/N]: " overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            print_info "Skipping environment setup"
            return 0
        fi
    fi
    
    # Get Solana RPC URL
    echo ""
    print_info "Solana RPC Configuration:"
    echo "1. Free (Rate Limited): https://api.mainnet-beta.solana.com"
    echo "2. Ankr: https://rpc.ankr.com/solana"
    echo "3. Custom RPC endpoint"
    echo ""
    
    read -p "Enter Solana RPC URL (press Enter for default): " solana_rpc
    if [ -z "$solana_rpc" ]; then
        solana_rpc=$DEFAULT_SOLANA_RPC
    fi
    
    # Get Bot API URL
    echo ""
    print_info "Discord Bot API Configuration:"
    echo "For development: http://localhost:8080"
    echo "For production: https://your-bot-domain.com"
    echo ""
    
    read -p "Enter Discord Bot API URL: " bot_api_url
    if [ -z "$bot_api_url" ]; then
        print_error "Bot API URL is required"
        exit 1
    fi
    
    # Create .env.local file
    cat > .env.local << EOF
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=$solana_rpc

# Discord Bot API Configuration  
NEXT_PUBLIC_BOT_API_URL=$bot_api_url

# Generated on: $(date)
EOF
    
    print_success "Environment variables saved to .env.local"
    
    # Show the configuration
    echo ""
    print_info "Configuration:"
    echo "  Solana RPC: $solana_rpc"
    echo "  Bot API URL: $bot_api_url"
}

# =============================================================================
# Dependency Installation
# =============================================================================

install_dependencies() {
    print_header "Installing Dependencies"
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        print_info "node_modules exists, checking if update needed..."
        
        # Check if package-lock.json is newer than node_modules
        if [ "package-lock.json" -nt "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
            print_info "Dependencies need to be updated"
            npm ci
        else
            print_success "Dependencies are up to date"
            return 0
        fi
    else
        print_info "Installing dependencies..."
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# =============================================================================
# Build Process
# =============================================================================

build_project() {
    print_header "Building Project"
    
    # Clean previous build
    if [ -d ".next" ]; then
        print_info "Cleaning previous build..."
        rm -rf .next
    fi
    
    # Build the project
    print_info "Building Next.js application..."
    if npm run build; then
        print_success "Build completed successfully"
    else
        print_error "Build failed"
        print_info "Try running 'npm run dev' locally to debug issues"
        exit 1
    fi
}

# =============================================================================
# Vercel Deployment
# =============================================================================

setup_vercel() {
    print_header "Setting Up Vercel"
    
    # Check if Vercel CLI is installed
    if ! check_command vercel; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
    else
        print_success "Vercel CLI already installed"
    fi
    
    # Check if user is logged in
    if ! vercel whoami &> /dev/null; then
        print_info "Please login to Vercel..."
        vercel login
    else
        local vercel_user=$(vercel whoami)
        print_success "Logged in as: $vercel_user"
    fi
}

deploy_to_vercel() {
    print_header "Deploying to Vercel"
    
    # Check if this is first deployment
    if [ ! -f ".vercel/project.json" ]; then
        print_info "First deployment detected..."
        print_info "Setting up new Vercel project..."
        
        # Deploy with setup
        if vercel --name "$PROJECT_NAME" --yes; then
            print_success "Initial deployment successful"
        else
            print_error "Initial deployment failed"
            exit 1
        fi
    else
        print_info "Deploying updates..."
        if vercel; then
            print_success "Deployment successful"
        else
            print_error "Deployment failed"
            exit 1
        fi
    fi
    
    # Deploy to production
    print_info "Deploying to production..."
    if vercel --prod; then
        print_success "Production deployment successful"
    else
        print_error "Production deployment failed"
        exit 1
    fi
}

# =============================================================================
# Environment Variables Setup
# =============================================================================

setup_vercel_env() {
    print_header "Setting Up Vercel Environment Variables"
    
    if [ ! -f ".env.local" ]; then
        print_error ".env.local not found. Run environment setup first."
        exit 1
    fi
    
    # Read environment variables
    source .env.local
    
    print_info "Setting environment variables in Vercel..."
    
    # Set Solana RPC URL
    echo "$NEXT_PUBLIC_SOLANA_RPC_URL" | vercel env add NEXT_PUBLIC_SOLANA_RPC_URL production
    print_success "NEXT_PUBLIC_SOLANA_RPC_URL set"
    
    # Set Bot API URL
    echo "$NEXT_PUBLIC_BOT_API_URL" | vercel env add NEXT_PUBLIC_BOT_API_URL production
    print_success "NEXT_PUBLIC_BOT_API_URL set"
    
    # Redeploy to apply environment variables
    print_info "Redeploying to apply environment variables..."
    vercel --prod
    
    print_success "Environment variables configured"
}

# =============================================================================
# Get Deployment URL
# =============================================================================

get_deployment_url() {
    print_header "Getting Deployment Information"
    
    # Get the deployment URL
    local deployment_url=$(vercel ls --scope $(vercel whoami) | grep "$PROJECT_NAME" | head -n1 | awk '{print $2}')
    
    if [ -z "$deployment_url" ]; then
        # Alternative method to get URL
        deployment_url=$(vercel inspect --scope $(vercel whoami) 2>/dev/null | grep "url:" | head -n1 | awk '{print $2}')
    fi
    
    if [ -n "$deployment_url" ]; then
        # Ensure it has https://
        if [[ ! $deployment_url =~ ^https?:// ]]; then
            deployment_url="https://$deployment_url"
        fi
        
        echo ""
        print_success "🎉 Deployment Complete!"
        echo ""
        print_info "Your webapp is live at:"
        echo -e "${GREEN}  $deployment_url${NC}"
        echo ""
        print_info "Next steps:"
        echo "1. Update your Discord bot's config.json:"
        echo "   \"vercel_frontend_url\": \"$deployment_url\""
        echo "2. Restart your Discord bot"
        echo "3. Test the verification flow"
        echo ""
        
        # Save URL to file for easy access
        echo "$deployment_url" > deployment-url.txt
        print_info "URL saved to deployment-url.txt"
    else
        print_warning "Could not automatically detect deployment URL"
        print_info "Check your Vercel dashboard at https://vercel.com/dashboard"
    fi
}

# =============================================================================
# Main Deployment Flow
# =============================================================================

main() {
    print_header "Discord Wallet Verification - Vercel Deployment"
    
    # Change to script directory
    cd "$SCRIPT_DIR"
    
    # Check what deployment stage to run
    case "${1:-full}" in
        "check")
            check_prerequisites
            ;;
        "env")
            setup_environment
            ;;
        "install")
            install_dependencies
            ;;
        "build")
            build_project
            ;;
        "deploy")
            setup_vercel
            deploy_to_vercel
            setup_vercel_env
            get_deployment_url
            ;;
        "full"|"")
            check_prerequisites
            setup_environment
            install_dependencies
            build_project
            setup_vercel
            deploy_to_vercel
            setup_vercel_env
            get_deployment_url
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  full     - Run complete deployment (default)"
            echo "  check    - Check prerequisites only"
            echo "  env      - Setup environment variables only"
            echo "  install  - Install dependencies only"
            echo "  build    - Build project only"
            echo "  deploy   - Deploy to Vercel only"
            echo "  help     - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Full deployment"
            echo "  $0 full         # Full deployment"
            echo "  $0 check        # Check prerequisites"
            echo "  $0 deploy       # Deploy only"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# =============================================================================
# Script Execution
# =============================================================================

# Trap errors and cleanup
trap 'print_error "Script failed at line $LINENO"' ERR

# Run main function with all arguments
main "$@"