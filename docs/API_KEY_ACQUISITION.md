# API Key Acquisition Guide for XxxCams.org

## Provider-Specific API Key Acquisition

### 1. XloveCam API
- **Website**: https://xlovecash.com
- **Steps**:
  1. Create an affiliate account
  2. Navigate to Promotool section
  3. Generate API credentials
  4. Copy Affiliate ID and Secret Key

### 2. AWEmpire API
- **Website**: https://awempire.com/affiliates
- **Steps**:
  1. Register as an affiliate
  2. Go to Developer Dashboard
  3. Create new API application
  4. Generate API Key and Secret

### 3. LiveJasmin API
- **Website**: https://partners.livejasmin.com
- **Steps**:
  1. Sign up as a partner
  2. Access Partner Control Panel
  3. Navigate to API Integration
  4. Request API credentials

### 4. Chaturbate API
- **Website**: https://chaturbate.com/affiliates/
- **Steps**:
  1. Create affiliate account
  2. Go to API Settings
  3. Generate API Token
  4. Whitelist your IP address

### Security Best Practices
- Never share API keys publicly
- Use environment variables
- Rotate keys periodically
- Implement IP whitelisting
- Use least privilege principle

## Storing API Keys Securely

### GitHub Secrets
1. Go to repository Settings
2. Navigate to "Secrets and variables"
3. Add secrets:
   - `XLOVECAM_AFFILIATE_ID`
   - `XLOVECAM_SECRET_KEY`
   - `AWEMPIRE_API_KEY`
   - etc.

### Local Development
- Use `.env.local` for local testing
- Add `.env.local` to `.gitignore`

### Production Deployment
- Use cloud secret management
- Utilize GitHub Actions secrets
- Implement runtime secret injection
