const fs = require('fs');
const crypto = require('crypto');

class ConfigManager {
  constructor(configPath = './config.json') {
    this.configPath = configPath;
    this.encryptionKey = this.generateEncryptionKey();
  }

  generateEncryptionKey() {
    return crypto.randomBytes(32);
  }

  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      data: encrypted
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc', 
      this.encryptionKey, 
      Buffer.from(encryptedData.iv, 'hex')
    );
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }

  updateConfig(newConfig) {
    const encryptedConfig = this.encrypt(newConfig);
    fs.writeFileSync(this.configPath, JSON.stringify(encryptedConfig));
    this.triggerConfigUpdate();
  }

  getCurrentConfig() {
    try {
      const encryptedData = JSON.parse(fs.readFileSync(this.configPath));
      return this.decrypt(encryptedData);
    } catch (error) {
      return null;
    }
  }

  triggerConfigUpdate() {
    // Trigger deployment or service restart
    try {
      const { execSync } = require('child_process');
      execSync('docker-compose restart');
      console.log('Configuration updated and services restarted');
    } catch (error) {
      console.error('Failed to restart services', error);
    }
  }

  // Real-time configuration monitoring
  startConfigWatcher() {
    fs.watch(this.configPath, (eventType) => {
      if (eventType === 'change') {
        console.log('Configuration file changed. Updating services...');
        this.triggerConfigUpdate();
      }
    });
  }
}

module.exports = new ConfigManager();
