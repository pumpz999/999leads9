import React from 'react';
import { motion } from 'framer-motion';

const ModelCard = ({ model }) => {
  return (
    <motion.div 
      className="model-card"
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="model-image">
        <img 
          src={model.image || 'https://via.placeholder.com/300'} 
          alt={model.nickname} 
        />
        <div className="model-overlay">
          <h3>{model.nickname}</h3>
          <p>{model.country}</p>
        </div>
      </div>
      <div className="model-details">
        <span className={`status ${model.isOnline ? 'online' : 'offline'}`}>
          {model.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </motion.div>
  );
};

export default ModelCard;
