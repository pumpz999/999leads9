#!/bin/bash

# Comprehensive Auto-Deployment Script

set -euo pipefail

# Configuration
DOMAIN="999leads.com"
REPO_URL="https://github.com/pumpz999/999leads9.git"
DEPLOY_DIR="/var/www/999leads"

# Logging
log() {
    echo "[DEPLOY] $1"
}

# Pre-deployment checks
pre_deploy_checks() {
    # Check Docker installation
    if ! command -v docker &> /dev/null; then
        log "Docker not found. Installing..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log "Docker Compose not found. Installing..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -S)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
}

# Clone or update repository
update_repository() {
    if [ ! -d "$DEPLOY_DIR" ]; then
        git clone "$REPO_URL" "$DEPLOY_DIR"
    else
        cd "$DEPLOY_DIR"
        git pull origin main
    fi
}

# Generate SSL Certificates
generate_ssl() {
    docker run -it --rm \
        -v "$DEPLOY_DIR/certbot/conf:/etc/letsencrypt" \
        -v "$DEPLOY_DIR/certbot/www:/var/www/certbot" \
        certbot/certbot certonly \
        --standalone \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --email "999leadsolutions@gmail.com" \
        --agree-tos \
        --no-eff-email
}

# Deploy Docker Containers
deploy_containers() {
    cd "$DEPLOY_DIR"
    docker-compose down
    docker-compose up -d --build
}

# Main Deployment Workflow
main() {
    log "Starting Deployment for 999Leads Platform"
    
    pre_deploy_checks
    update_repository
    generate_ssl
    deploy_containers
    
    log "Deployment Completed Successfully!"
}

# Execute Main Deployment
main
