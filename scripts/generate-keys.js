const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const generateSecureKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateEnvFile = () => {
  const envContent = `
VITE_ENCRYPTION_KEY=${generateSecureKey()}
VITE_JWT_SECRET=${generateSecureKey(64)}
VITE_API_RATE_LIMIT=100
VITE_API_RATE_WINDOW_MS=900000
`;

  const envPath = path.resolve(__dirname, '../.env.local');
  fs.writeFileSync(envPath, envContent);
  console.log('Secure environment keys generated successfully.');
};

generateEnvFile();
