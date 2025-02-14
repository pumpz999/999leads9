import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const categories = [
    'Blonde', 'Brunette', 'Redhead', 'Asian', 'Latina', 'Ebony', 'Mature', 'Lesbian', 'Gay', 'Fetish',
  ];

  return (
    <div className="sidebar">
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link to={`/models?category=${category.toLowerCase()}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
