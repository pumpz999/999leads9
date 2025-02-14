const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

class ModelRefreshManager {
  constructor() {
    this.PROVIDERS = [
      {
        name: 'XloveCam',
        endpoint: 'https://webservice-affiliate.xlovecam.com/model/filterList/',
        credentials: {
          affiliateId: process.env.XLOVECAM_AFFILIATE_ID,
          secretKey: process.env.XLOVECAM_SECRET_KEY
        }
      },
      // Add more providers here
    ];
    this.CACHE_FILE = './data/models.json';
  }

  async fetchModels() {
    const allModels = [];

    for (const provider of this.PROVIDERS) {
      try {
        const response = await this.fetchProviderModels(provider);
        allModels.push(...response);
      } catch (error) {
        console.error(`Error fetching models from ${provider.name}:`, error);
      }
    }

    return this.processAndCacheModels(allModels);
  }

  async fetchProviderModels(provider) {
    const timestamp = Math.floor(Date.now() / 1000);
    
    const response = await axios.post(provider.endpoint, new URLSearchParams({
      authServiceId: '2',
      authItemId: provider.credentials.affiliateId,
      authSecret: provider.credentials.secretKey,
      timestamp: timestamp,
      lang: 'en'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.content || [];
  }

  processAndCacheModels(models) {
    // Deduplicate and enrich models
    const processedModels = models.map(model => ({
      ...model,
      id: this.generateUniqueId(model),
      lastUpdated: new Date().toISOString()
    }));

    // Cache models
    fs.writeFileSync(this.CACHE_FILE, JSON.stringify(processedModels, null, 2));

    return processedModels;
  }

  generateUniqueId(model) {
    const modelString = `${model.nickname}${model.country}${model.id}`;
    return crypto.createHash('md5').update(modelString).digest('hex');
  }

  // Periodic cleanup of stale models
  cleanStaleCachedModels() {
    try {
      const models = JSON.parse(fs.readFileSync(this.CACHE_FILE));
      const currentTime = new Date();
      
      const freshModels = models.filter(model => {
        const modelAge = new Date(model.lastUpdated);
        const hoursDiff = (currentTime - modelAge) / (1000 * 60 * 60);
        return hoursDiff < 24; // Keep models less than 24 hours old
      });

      fs.writeFileSync(this.CACHE_FILE, JSON.stringify(freshModels, null, 2));
    } catch (error) {
      console.error('Error cleaning stale models:', error);
    }
  }
}

// Run refresh on script execution
const modelRefreshManager = new ModelRefreshManager();
modelRefreshManager.fetchModels();
modelRefreshManager.cleanStaleCachedModels();
