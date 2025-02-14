import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Fetch search history from the server or local storage
    const history = ['Blonde', 'Latina', 'Mature', 'Fetish'];
    setSearchHistory(history);
  }, []);

  return (
    <footer>
      <div className="search-history">
        <h3>Previous Searches</h3>
        <ul>
          {searchHistory.map((search) => (
            <li key={search}>
              <a href={`/models?category=${search.toLowerCase()}`}>{search}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer-info">
        <p>&copy; 2023 XxxCams.org. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
