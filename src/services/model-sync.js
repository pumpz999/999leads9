const axios = require('axios');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const { PROVIDERS } = require('../config/providers');

class ModelSyncService {
  constructor() {
    // In-memory cache with 10-minute TTL
    this.modelCache = new NodeCache({ 
      stdTTL: 600, 
      checkperiod: 120 
    });

    // Tracking sync status
    this.syncStatus = {};
  }

  async fetchModelFromProvider(provider) {
    try {
      const { name, endpoint, credentials, active } = provider;
      
      if (!active) return [];

      const timestamp = Math.floor(Date.now() / 1000);
      
      const response = await axios.post(endpoint, new URLSearchParams({
        authServiceId: '2',
        authItemId: credentials.affiliateId || credentials.username,
        authSecret: credentials.secretKey || credentials.apiKey,
        timestamp: timestamp,
        lang: 'en'
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Process and enrich models
      return (response.data.content || []).map(model => ({
        ...model,
        id: uuidv4(),
        providerName: name,
        syncedAt: new Date().toISOString()
      }));
    } catch (error) {
      logger.error(`Error fetching models from ${provider.name}:`, error);
      return [];
    }
  }

  async syncAllModels() {
    const startTime = Date.now();
    logger.info('Starting model synchronization');

    try {
      // Parallel model fetching
      const modelPromises = PROVIDERS.map(provider => 
        this.fetchModelFromProvider(provider)
      );

      const modelResults = await Promise.all(modelPromises);
      const flattenedModels = modelResults.flat();

      // Update cache
      this.modelCache.set('models', flattenedModels);

      // Update sync status
      this.syncStatus = {
        lastSync: new Date().toISOString(),
        totalModels: flattenedModels.length,
        duration: Date.now() - startTime
      };

      logger.info(`Sync completed: ${flattenedModels.length} models`);
    } catch (error) {
      logger.error('Model synchronization failed:', error);
    }
  }

  getModels() {
    return this.modelCache.get('models') || [];
  }

  getSyncStatus() {
    return this.syncStatus;
  }
}

module.exports = new ModelSyncService();
