import React, { useState, useEffect } from 'react';
import { PROVIDER_CONFIGURATIONS, ADDITIONAL_PROVIDERS } from '../config/providerConfig';
import MultiProviderApiService from '../services/multiProviderApiService';

const AdminProviderConfig = () => {
  const [selectedProvider, setSelectedProvider] = useState('XLOVECAM');
  const [providerConfigs, setProviderConfigs] = useState({});
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    // Load saved configurations from localStorage
    const savedConfigs = JSON.parse(localStorage.getItem('providerConfigurations') || '{}');
    setProviderConfigs(savedConfigs);
  }, []);

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
  };

  const updateProviderConfig = (field, value) => {
    setProviderConfigs(prev => ({
      ...prev,
      [selectedProvider]: {
        ...prev[selectedProvider],
        [field]: value
      }
    }));
  };

  const saveProviderConfiguration = () => {
    localStorage.setItem('providerConfigurations', JSON.stringify(providerConfigs));
    alert('Provider configuration saved successfully!');
  };

  const testProviderConnection = async () => {
    try {
      const apiService = new MultiProviderApiService(
        selectedProvider, 
        providerConfigs[selectedProvider]
      );

      const onlineModels = await apiService.getOnlineModels();
      setTestResults(onlineModels);
    } catch (error) {
      alert('Connection test failed: ' + error.message);
    }
  };

  const renderProviderFields = () => {
    const currentProvider = PROVIDER_CONFIGURATIONS[selectedProvider];
    return Object.keys(currentProvider.defaultCredentials).map(field => (
      <div key={field} className="config-field">
        <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
        <input
          type="text"
          value={providerConfigs[selectedProvider]?.[field] || ''}
          onChange={(e) => updateProviderConfig(field, e.target.value)}
          placeholder={`Enter ${field}`}
        />
      </div>
    ));
  };

  return (
    <div className="admin-provider-config">
      <h1>Multi-Provider API Configuration</h1>
      
      <div className="provider-selector">
        <h2>Select Provider</h2>
        <div className="provider-buttons">
          {Object.keys(PROVIDER_CONFIGURATIONS).map(provider => (
            <button
              key={provider}
              className={selectedProvider === provider ? 'active' : ''}
              onClick={() => handleProviderChange(provider)}
            >
              {PROVIDER_CONFIGURATIONS[provider].name}
            </button>
          ))}
        </div>
      </div>

      <div className="provider-configuration">
        <h2>{PROVIDER_CONFIGURATIONS[selectedProvider].name} Configuration</h2>
        {renderProviderFields()}
        
        <div className="config-actions">
          <button onClick={saveProviderConfiguration}>Save Configuration</button>
          <button onClick={testProviderConnection}>Test Connection</button>
        </div>
      </div>

      {testResults && (
        <div className="connection-test-results">
          <h2>Connection Test Results</h2>
          <pre>{JSON.stringify(testResults, null, 2)}</pre>
        </div>
      )}

      <div className="additional-providers">
        <h2>Additional Providers</h2>
        <ul>
          {ADDITIONAL_PROVIDERS.map(provider => (
            <li key={provider}>{provider}</li>
          ))}
        </ul>
        <p>Contact support to integrate more providers</p>
      </div>
    </div>
  );
};

export default AdminProviderConfig;
