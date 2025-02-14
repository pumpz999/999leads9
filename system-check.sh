#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Comprehensive System Check
echo "🔍 Running XxxCams.org System Diagnostic..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js Version: $NODE_VERSION${NC}"

# Check NPM
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ NPM is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓ NPM Version: $NPM_VERSION${NC}"

# Check Required Environment Variables
REQUIRED_VARS=(
    "VITE_APP_NAME"
    "VITE_XLOVECAM_AFFILIATE_ID"
    "VITE_XLOVECAM_SECRET_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}✗ Environment variable $var is not set${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ All required environment variables are set${NC}"

# Install Dependencies
echo "📦 Installing dependencies..."
npm ci || { echo -e "${RED}✗ Dependency installation failed${NC}"; exit 1; }

# Run Diagnostic Script
echo "🕵️ Running diagnostic script..."
node diagnostic-script.js

# Build Project
echo "🏗️ Building project..."
npm run build || { echo -e "${RED}✗ Build failed${NC}"; exit 1; }

echo -e "${GREEN}✓ System Check Completed Successfully!${NC}"
