#!/bin/bash

# Ultimate Deployment Script for 999Leads Platform
# Comprehensive VPS Preparation and Auto-Deployment

set -euo pipefail

# ANSI Color Codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Global Configuration
DOMAIN="999leads.com"
SERVER_IP="153.92.208.206"
ADMIN_EMAIL="999leadsolutions@gmail.com"
GIT_REPO="https://github.com/pumpz999/999leads9.git"
GIT_BRANCH="main"

# Logging Function
log() {
    echo -e "${GREEN}[DEPLOYMENT LOG]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# System Update and Upgrade
system_preparation() {
    log "Preparing System: Updating and Upgrading..."
    
    # Ensure non-interactive mode
    export DEBIAN_FRONTEND=noninteractive
    
    # Update package lists
    apt-get update -y
    
    # Upgrade system packages
    apt-get upgrade -y
    
    # Install essential dependencies
    apt-get install -y \
        curl \
        wget \
        git \
        build-essential \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        unzip \
        zip \
        fail2ban \
        ufw
}

# Docker Installation
install_docker() {
    log "Installing Docker and Docker Compose..."
    
    # Remove existing Docker installations
    apt-get remove -y docker docker-engine docker.io containerd runc
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up Docker repository
    echo \
      "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Enable Docker service
    systemctl enable docker
    systemctl start docker
}

# Node.js and NPM Installation
install_nodejs() {
    log "Installing Node.js and NPM..."
    
    # Remove existing Node.js
    apt-get purge -y nodejs npm
    
    # Add NodeSource repository for Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    
    # Install Node.js
    apt-get install -y nodejs
    
    # Update NPM to latest
    npm install -g npm@latest
}

# Firewall and Security Configuration
configure_security() {
    log "Configuring Firewall and Security..."
    
    # UFW Configuration
    ufw disable
    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw enable
    
    # Fail2Ban Configuration
    cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
    sed -i 's/bantime  = 10m/bantime  = 1h/' /etc/fail2ban/jail.local
    sed -i 's/maxretry = 5/maxretry = 3/' /etc/fail2ban/jail.local
    
    systemctl enable fail2ban
    systemctl restart fail2ban
}

# SSL and HTTPS Setup
setup_ssl() {
    log "Setting up SSL with Let's Encrypt..."
    
    # Install Certbot
    snap install --classic certbot
    ln -s /snap/bin/certbot /usr/bin/certbot
    
    # Obtain SSL Certificate
    certbot certonly \
        --standalone \
        -d ${DOMAIN} \
        -d www.${DOMAIN} \
        --email ${ADMIN_EMAIL} \
        --agree-tos \
        --no-eff-email \
        --force-renewal
    
    # Setup Auto-Renewal
    echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew --quiet" | sudo tee -a /etc/crontab > /dev/null
}

# Project Deployment
deploy_project() {
    log "Deploying 999Leads Platform..."
    
    # Clone Repository
    git clone ${GIT_REPO} /var/www/999leads
    cd /var/www/999leads
    git checkout ${GIT_BRANCH}
    
    # Create Docker Compose File
    cat > docker-compose.yml <<EOL
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - .:/app
    restart: always

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    restart: always

  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 30
    restart: always
EOL

    # Build and Start Services
    docker-compose up -d --build
}

# Monitoring and Logging Setup
setup_monitoring() {
    log "Configuring Monitoring and Logging..."
    
    # Install Prometheus Node Exporter
    docker run -d \
        --net="host" \
        --pid="host" \
        -v "/:/host:ro,rslave" \
        quay.io/prometheus/node-exporter \
        --path.rootfs=/host
    
    # Setup Log Rotation
    cat > /etc/logrotate.d/999leads <<EOL
/var/www/999leads/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 root adm
}
EOL
}

# Main Deployment Workflow
main_deployment() {
    log "🚀 Starting Ultimate Deployment for 999Leads Platform 🚀"
    
    # Execute Deployment Stages
    system_preparation
    install_docker
    install_nodejs
    configure_security
    setup_ssl
    deploy_project
    setup_monitoring
    
    log "🎉 Deployment Completed Successfully! 🎉"
}

# Execute Main Deployment
main_deployment
