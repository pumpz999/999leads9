#!/bin/bash

# 999Leads Platform Setup Script

# Update and Upgrade System
sudo apt update && sudo apt upgrade -y

# Install Node.js and NPM
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 Globally
sudo npm install -g pm2

# Install Project Dependencies
npm install express compression helmet axios

# Create Necessary Directories
mkdir -p data public

# Setup Crontab
sudo cp crontab /etc/cron.d/999leads
sudo chmod 644 /etc/cron.d/999leads

# Set Permissions
sudo chown -R $(whoami):$(whoami) /var/www/999leads

# Start Application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
