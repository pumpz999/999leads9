import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModelCard from '../components/ModelCard';
import MultiProviderApiService from '../services/multiProviderApiService';

const HomePage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const apiService = new MultiProviderApiService('XLOVECAM');
        const onlineModels = await apiService.getOnlineModels(12);
        setModels(onlineModels);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.1 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="homepage"
    >
      <header className="hero-section">
        <h1>XxxCams.org</h1>
        <p>Discover Live Cam Models from Around the World</p>
      </header>

      <section className="featured-models">
        <h2>Online Models</h2>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="model-grid">
            {models.map(model => (
              <ModelCard 
                key={model.id} 
                model={model} 
              />
            ))}
          </div>
        )}
      </section>

      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="category-grid">
          {['Blonde', 'Brunette', 'Asian', 'Latina', 'Mature', 'Teen'].map(category => (
            <motion.div 
              key={category} 
              className="category-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
