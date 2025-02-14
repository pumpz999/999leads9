const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class CleanupService {
  constructor() {
    this.logDirectory = path.join(__dirname, '../../logs');
    this.dataDirectory = path.join(__dirname, '../../data');
  }

  cleanLogs() {
    try {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      
      const logFiles = fs.readdirSync(this.logDirectory);
      
      logFiles.forEach(file => {
        const filePath = path.join(this.logDirectory, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < tenDaysAgo) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted old log file: ${file}`);
        }
      });
    } catch (error) {
      logger.error('Log cleanup failed:', error);
    }
  }

  cleanTempData() {
    try {
      const dataFiles = fs.readdirSync(this.dataDirectory);
      
      dataFiles.forEach(file => {
        const filePath = path.join(this.dataDirectory, file);
        fs.unlinkSync(filePath);
        logger.info(`Deleted temporary data file: ${file}`);
      });
    } catch (error) {
      logger.error('Temp data cleanup failed:', error);
    }
  }

  performSystemCleanup() {
    this.cleanLogs();
    this.cleanTempData();
  }
}

module.exports = new CleanupService();
