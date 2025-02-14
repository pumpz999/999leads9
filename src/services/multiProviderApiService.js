import { PROVIDER_CONFIGURATIONS } from '../config/providerConfig';

class MultiProviderApiService {
  constructor(providerName, credentials) {
    this.providerName = providerName;
    this.providerConfig = PROVIDER_CONFIGURATIONS[providerName];
    this.credentials = { ...this.providerConfig.defaultCredentials, ...credentials };
  }

  async fetchData(endpoint, params = {}) {
    try {
      const url = `${this.providerConfig.apiEndpoint}${endpoint}`;
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.generateAuthHeader()
        },
        body: JSON.stringify({
          ...params,
          ...this.credentials
        })
      };

      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`API request failed for ${this.providerName}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error in ${this.providerName} API:`, error);
      throw error;
    }
  }

  generateAuthHeader() {
    // Implement provider-specific authentication
    switch(this.providerName) {
      case 'XLOVECAM':
        return `Basic ${btoa(`${this.credentials.affiliateId}:${this.credentials.secretKey}`)}`;
      case 'AWEMPIRE':
        return `Bearer ${this.credentials.apiKey}`;
      case 'LIVEJASMIN':
        return `ApiKey ${this.credentials.apiKey}`;
      case 'CHATURBATE':
        return `Token ${this.credentials.apiKey}`;
      default:
        throw new Error('Unsupported provider authentication');
    }
  }

  async getOnlineModels(limit = 20) {
    const endpoint = this.providerConfig.supportedEndpoints[1];
    return this.fetchData(endpoint, { limit });
  }

  async getModelDetails(modelIds) {
    const endpoint = this.providerConfig.supportedEndpoints[2];
    return this.fetchData(endpoint, { modelIds });
  }
}

export default MultiProviderApiService;
