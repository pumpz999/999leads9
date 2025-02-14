#!/bin/bash

# Deployment Script for XxxCams.org

# Exit on any error
set -e

# Environment Configuration
ENV=${1:-development}
REPO_URL="git@github.com:yourusername/xxxcams-platform.git"
DEPLOY_DIR="/var/www/xxxcams"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Logging function
log() {
    echo -e "${GREEN}[DEPLOY] $1${NC}"
}

# Error handling function
error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Pre-deployment checks
pre_deploy_checks() {
    log "Running pre-deployment checks..."
    
    # Check Node.js version
    if ! node --version | grep -q "v18"; then
        error "Node.js 18.x is required"
    fi

    # Check git availability
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi
}

# Clone or update repository
update_repository() {
    log "Updating repository..."
    
    if [ ! -d "$DEPLOY_DIR" ]; then
        git clone "$REPO_URL" "$DEPLOY_DIR"
    fi

    cd "$DEPLOY_DIR"
    git fetch origin
    git checkout "$ENV"
    git pull origin "$ENV"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    npm ci
    npm run build
}

# Configure environment
configure_environment() {
    log "Configuring environment..."
    cp ".env.$ENV" .env
    
    # Generate secure keys if not exists
    if [ ! -f ".env.local" ]; then
        log "Generating secure environment keys..."
        node scripts/generate-keys.js
    fi
}

# Start application
start_application() {
    log "Starting application..."
    
    if [ "$ENV" == "production" ]; then
        pm2 restart ecosystem.config.js --env production
    else
        npm run dev
    fi
}

# Main deployment workflow
main() {
    log "Starting deployment for $ENV environment"
    
    pre_deploy_checks
    update_repository
    configure_environment
    install_dependencies
    start_application

    log "Deployment completed successfully!"
}

# Execute main function
main
