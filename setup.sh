#!/bin/bash

# System Preparation and Deployment Script

# Update System
sudo apt update && sudo apt upgrade -y

# Install Node.js and NPM
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 Globally
sudo npm install -g pm2

# Create Project Directory
mkdir -p /var/www/model-sync
cd /var/www/model-sync

# Clone Repository (Replace with your actual repository)
git clone https://github.com/your-org/model-sync-platform.git .

# Install Dependencies
npm install

# Create Necessary Directories
mkdir -p logs data

# Set Permissions
sudo chown -R $(whoami):$(whoami) /var/www/model-sync

# Start Application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Optional: Setup Firewall
sudo ufw allow 3000/tcp
