import React, { useState, useEffect } from 'react';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/apiConfig';

const AdminPanel = () => {
  const [config, setConfig] = useState({
    affiliateId: DEFAULT_AFFILIATE_CONFIG.affiliateId,
    secretKey: DEFAULT_AFFILIATE_CONFIG.secretKey,
    endpoint: DEFAULT_AFFILIATE_CONFIG.endpoint
  });

  const [apiTestResults, setApiTestResults] = useState({
    onlineModels: null,
    filteredModels: null,
    modelStatus: null,
    modelProfiles: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testApiConnections = async () => {
    try {
      const XloveCamApiService = (await import('../services/apiService')).default;
      const apiService = new XloveCamApiService(config);

      const onlineModels = await apiService.getOnlineModels(5);
      const filteredModels = await apiService.getFilteredModels({ limit: 5 });
      
      const modelIds = onlineModels.map(model => model.id).slice(0, 2);
      const modelStatus = await apiService.checkModelOnlineStatus(modelIds);
      const modelProfiles = await apiService.getModelProfiles(modelIds);

      setApiTestResults({
        onlineModels,
        filteredModels,
        modelStatus,
        modelProfiles
      });
    } catch (error) {
      console.error('API Test Failed:', error);
      alert('API Connection Test Failed. Check your credentials.');
    }
  };

  const saveConfiguration = () => {
    localStorage.setItem('xxxcams_affiliate_config', JSON.stringify(config));
    alert('Configuration Saved Successfully!');
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('xxxcams_affiliate_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  return (
    <div className="admin-panel">
      <h1>XxxCams.org Admin Configuration</h1>
      
      <section className="api-settings">
        <h2>API Configuration</h2>
        <div className="input-group">
          <label>Affiliate ID</label>
          <input 
            type="text" 
            name="affiliateId"
            value={config.affiliateId}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label>Secret Key</label>
          <input 
            type="text" 
            name="secretKey"
            value={config.secretKey}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label>API Endpoint</label>
          <input 
            type="text" 
            name="endpoint"
            value={config.endpoint}
            onChange={handleInputChange}
          />
        </div>

        <div className="action-buttons">
          <button onClick={saveConfiguration}>Save Configuration</button>
          <button onClick={testApiConnections}>Test API Connections</button>
        </div>
      </section>

      {apiTestResults.onlineModels && (
        <section className="api-test-results">
          <h2>API Test Results</h2>
          <div className="result-grid">
            <div>
              <h3>Online Models</h3>
              <pre>{JSON.stringify(apiTestResults.onlineModels, null, 2)}</pre>
            </div>
            <div>
              <h3>Filtered Models</h3>
              <pre>{JSON.stringify(apiTestResults.filteredModels, null, 2)}</pre>
            </div>
            <div>
              <h3>Model Status</h3>
              <pre>{JSON.stringify(apiTestResults.modelStatus, null, 2)}</pre>
            </div>
            <div>
              <h3>Model Profiles</h3>
              <pre>{JSON.stringify(apiTestResults.modelProfiles, null, 2)}</pre>
            </div>
          </div>
        </section>
      )}

      <section className="documentation">
        <h2>API Configuration Guide</h2>
        <div className="doc-content">
          <h3>How to Get Affiliate Credentials</h3>
          <ol>
            <li>Visit XloveCash Promotool page</li>
            <li>Login to your affiliate account</li>
            <li>Navigate to API Settings section</li>
            <li>Generate or copy your Affiliate ID</li>
            <li>Generate or copy your Secret Key</li>
          </ol>

          <h3>Endpoint Configuration</h3>
          <p>Default endpoint is: https://webservice-affiliate.xlovecam.com</p>
          <p>Only change if instructed by XloveCam support</p>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
