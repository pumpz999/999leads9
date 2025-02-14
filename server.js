const express = require('express');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(helmet());
app.use(express.json());

// File-based "Database" Routes
app.get('/api/models', (req, res) => {
  try {
    const models = JSON.parse(fs.readFileSync('./data/models.json'));
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch models' });
  }
});

// Static File Serving
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
