#!/bin/bash

# Comprehensive Deployment Script for 999Leads Platform

# Strict error handling
set -euo pipefail

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration Variables
DOMAIN="999leads.com"
SERVER_IP="153.92.208.206"
GIT_REPO="https://github.com/pumpz999/999leads9.git"
ADMIN_EMAIL="999leadsolutions@gmail.com"

# Logging function
log() {
    echo -e "${GREEN}[DEPLOYMENT LOG]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Pre-deployment system checks
system_check() {
    log "Running system compatibility checks..."
    
    # Check required tools
    for tool in docker nginx certbot git node npm; do
        if ! command -v $tool &> /dev/null; then
            error "$tool is not installed"
        fi
    done

    # Check server resources
    total_memory=$(free -g | awk '/^Mem:/{print $2}')
    if [[ $total_memory -lt 4 ]]; then
        error "Insufficient memory. Minimum 4GB RAM required."
    fi
}

# Secure configuration management
setup_secure_config() {
    log "Setting up secure configuration management..."
    
    # Create encrypted configuration vault
    mkdir -p /etc/999leads/secrets
    
    # Generate encryption key
    openssl rand -base64 32 > /etc/999leads/secrets/encryption_key
    
    # Store sensitive configurations securely
    cat > /etc/999leads/secrets/deployment_config.json <<EOL
{
    "domain": "${DOMAIN}",
    "admin_email": "${ADMIN_EMAIL}",
    "git_repo": "${GIT_REPO}",
    "server_ip": "${SERVER_IP}"
}
EOL
    
    # Restrict access
    chmod 600 /etc/999leads/secrets/*
}

# Automated HTTPS and Firewall Setup
configure_network_security() {
    log "Configuring network security..."
    
    # UFW Firewall Configuration
    ufw disable
    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw enable
    
    # Nginx SSL Configuration with Certbot
    certbot certonly \
        --standalone \
        -d ${DOMAIN} \
        -d www.${DOMAIN} \
        --email ${ADMIN_EMAIL} \
        --agree-tos \
        --no-eff-email
    
    # Generate strong Diffie-Hellman parameters
    openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
}

# Docker-based deployment
docker_deployment() {
    log "Preparing Docker-based deployment..."
    
    # Create docker-compose file
    cat > docker-compose.yml <<EOL
version: '3.8'
services:
  web:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./:/app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    command: sh -c "npm install && npm run build && npm start"
  
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - web

  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 30
EOL
}

# Continuous Integration Configuration
setup_ci_cd() {
    log "Configuring Continuous Integration and Deployment..."
    
    # GitHub Actions Workflow
    mkdir -p .github/workflows
    cat > .github/workflows/main.yml <<EOL
name: 999Leads CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Production
        uses: appleboy/ssh-action@master
        with:
          host: $SERVER_IP
          username: root
          key: \${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/999leads
            git pull origin main
            docker-compose down
            docker-compose up -d --build
EOL
}

# Main deployment workflow
main_deployment() {
    system_check
    setup_secure_config
    configure_network_security
    docker_deployment
    setup_ci_cd
    
    log "🚀 Deployment Completed Successfully!"
}

# Execute deployment
main_deployment
