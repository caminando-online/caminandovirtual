const express = require('express');
const { checkDatabaseHealth } = require('../config/database');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connections health
    const dbHealth = await checkDatabaseHealth();

    // Check if all databases are healthy
    const allHealthy = Object.values(dbHealth).every(status => status === 'healthy');

    const healthStatus = {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development',
      databases: dbHealth
    };

    const statusCode = allHealthy ? 200 : 503;

    res.status(statusCode).json({
      success: allHealthy,
      data: healthStatus
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      error: 'Health check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();

    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development',
      databases: dbHealth,
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        pid: process.pid
      }
    };

    res.json({
      success: true,
      data: detailedHealth
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Detailed health check failed',
      message: error.message
    });
  }
});

module.exports = router;