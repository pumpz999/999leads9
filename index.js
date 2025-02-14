const express = require('express');
const cron = require('node-cron');
const ModelSyncService = require('./src/services/model-sync');
const CleanupService = require('./src/services/cleanup-service');
const logger = require('./src/services/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/api/models', (req, res) => {
  try {
    const models = ModelSyncService.getModels();
    res.json(models);
  } catch (error) {
    logger.error('Error fetching models:', error);
    res.status(500).json({ error: 'Could not fetch models' });
  }
});

app.get('/api/sync-status', (req, res) => {
  try {
    const syncStatus = ModelSyncService.getSyncStatus();
    res.json(syncStatus);
  } catch (error) {
    logger.error('Error fetching sync status:', error);
    res.status(500).json({ error: 'Could not fetch sync status' });
  }
});

// Periodic Model Sync (Every 3 minutes)
cron.schedule('*/3 * * * *', () => {
  ModelSyncService.syncAllModels();
});

// Periodic Cleanup (Every 10 days)
cron.schedule('0 0 */10 * *', () => {
  CleanupService.performSystemCleanup();
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  
  // Initial model sync on startup
  ModelSyncService.syncAllModels();
});
