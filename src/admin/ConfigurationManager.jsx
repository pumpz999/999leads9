import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfigurationManager = () => {
  const [configurations, setConfigurations] = useState({
    providers: [],
    deployment: {},
    security: {},
    monitoring: {}
  });

  const [newProvider, setNewProvider] = useState({
    name: '',
    apiKey: '',
    secretKey: ''
  });

  const fetchConfigurations = async () => {
    try {
      const response = await axios.get('/api/configurations');
      setConfigurations(response.data);
    } catch (error) {
      console.error('Failed to fetch configurations', error);
    }
  };

  const updateConfiguration = async (type, config) => {
    try {
      await axios.post(`/api/configurations/${type}`, config);
      await fetchConfigurations();
      alert('Configuration updated successfully!');
    } catch (error) {
      console.error('Failed to update configuration', error);
    }
  };

  const addApiProvider = async () => {
    try {
      await axios.post('/api/providers', newProvider);
      await fetchConfigurations();
      setNewProvider({ name: '', apiKey: '', secretKey: '' });
    } catch (error) {
      console.error('Failed to add provider', error);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  return (
    <div className="configuration-manager">
      <h1>Platform Configuration</h1>

      {/* API Providers Section */}
      <section>
        <h2>API Providers</h2>
        {configurations.providers.map(provider => (
          <div key={provider.name}>
            <h3>{provider.name}</h3>
            <p>Status: {provider.status}</p>
          </div>
        ))}

        <div className="add-provider">
          <input 
            placeholder="Provider Name" 
            value={newProvider.name}
            onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
          />
          <input 
            placeholder="API Key" 
            value={newProvider.apiKey}
            onChange={(e) => setNewProvider({...newProvider, apiKey: e.target.value})}
          />
          <button onClick={addApiProvider}>Add Provider</button>
        </div>
      </section>

      {/* Deployment Configuration */}
      <section>
        <h2>Deployment Settings</h2>
        <pre>{JSON.stringify(configurations.deployment, null, 2)}</pre>
        <button onClick={() => updateConfiguration('deployment', configurations.deployment)}>
          Update Deployment
        </button>
      </section>

      {/* Security Configuration */}
      <section>
        <h2>Security Settings</h2>
        <pre>{JSON.stringify(configurations.security, null, 2)}</pre>
        <button onClick={() => updateConfiguration('security', configurations.security)}>
          Update Security
        </button>
      </section>

      {/* Monitoring Configuration */}
      <section>
        <h2>Monitoring Dashboard</h2>
        <iframe 
          src="/monitoring" 
          title="Monitoring Dashboard" 
          width="100%" 
          height="500px"
        />
      </section>
    </div>
  );
};

export default ConfigurationManager;
