import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    'All', 'Blonde', 'Brunette', 'Asian', 
    'Latina', 'Mature', 'Teen', 'Fetish'
  ];

  const sidebarVariants = {
    open: { width: 250, transition: { duration: 0.3 } },
    closed: { width: 80, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="animated-sidebar"
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
    >
      <motion.button 
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-toggle"
      >
        {isOpen ? '←' : '→'}
      </motion.button>

      <div className="sidebar-categories">
        {categories.map((category, index) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isOpen ? 1 : 0, 
              x: isOpen ? 0 : -20 
            }}
            transition={{ delay: index * 0.1 }}
            className="category-item"
          >
            {category}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnimatedSidebar;
