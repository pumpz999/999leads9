import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [affiliateId, setAffiliateId] = useState('24010');
  const [secretKey, setSecretKey] = useState('d87ac7785760d9190ca3b4d366980ec2');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('https://webservice-affiliate.xlovecam.com/model/filterList/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            authServiceId: '2',
            authItemId: affiliateId,
            authSecret: secretKey,
            timestamp: Math.floor(Date.now() / 1000),
            lang: 'en',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setModels(data.content);
        } else {
          console.error('Error fetching models:', response.status);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, [affiliateId, secretKey]);

  return (
    <div>
      <Sidebar />
      <div className="model-list">
        <h1>XxxCams.org Model List</h1>
        <div className="model-grid">
          {models.map((model) => (
            <div key={model.id} className="model-card">
              <img src={model.image} alt={model.nickname} />
              <h3>{model.nickname}</h3>
              <p>{model.country}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModelList;
