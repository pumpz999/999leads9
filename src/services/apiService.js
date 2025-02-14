import { API_CONFIGURATIONS, DEFAULT_AFFILIATE_CONFIG } from '../config/apiConfig';

class XloveCamApiService {
  constructor(config = DEFAULT_AFFILIATE_CONFIG) {
    this.config = config;
  }

  async fetchModels(endpoint, additionalParams = {}) {
    try {
      const baseParams = {
        authServiceId: API_CONFIGURATIONS.XLOVECAM.DEFAULT_PARAMS.AUTH_SERVICE_ID,
        authItemId: this.config.affiliateId,
        authSecret: this.config.secretKey,
        timestamp: Math.floor(Date.now() / 1000),
        lang: API_CONFIGURATIONS.XLOVECAM.DEFAULT_PARAMS.LANGUAGE,
        ...additionalParams
      };

      const response = await fetch(this.config.endpoint + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(baseParams)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('API Fetch Error:', error);
      throw error;
    }
  }

  async getOnlineModels(limit = 20) {
    return this.fetchModels(
      API_CONFIGURATIONS.XLOVECAM.ENDPOINTS.PERFORMER_ONLINE, 
      { limit }
    );
  }

  async getFilteredModels(filters = {}) {
    return this.fetchModels(
      API_CONFIGURATIONS.XLOVECAM.ENDPOINTS.PERFORMER_FILTER, 
      filters
    );
  }

  async checkModelOnlineStatus(modelIds) {
    return this.fetchModels(
      API_CONFIGURATIONS.XLOVECAM.ENDPOINTS.PERFORMER_ONLINE_CHECK,
      { modelid: modelIds }
    );
  }

  async getModelProfiles(modelIds) {
    return this.fetchModels(
      API_CONFIGURATIONS.XLOVECAM.ENDPOINTS.PERFORMER_PROFILE,
      { modelid: modelIds }
    );
  }
}

export default XloveCamApiService;
