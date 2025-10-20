const { checkDatabaseHealth } = require('../config/database');

// Health controller
const getHealthStatus = async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();

    const allHealthy = Object.values(dbHealth).every(status => status === 'healthy');

    const healthData = {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      databases: dbHealth
    };

    res.json({
      success: true,
      data: healthData
    });

  } catch (error) {
    console.error('Health check controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    });
  }
};

module.exports = {
  getHealthStatus
};