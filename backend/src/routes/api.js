const express = require('express');
const router = express.Router();

// Import controllers
const healthController = require('../controllers/healthController');
const supermarketController = require('../controllers/supermarketController');

// API information endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Caminando Online API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      supermarkets: '/api/supermarkets',
      categories: '/api/categories',
      products: '/api/products'
    },
    documentation: 'API documentation available at /api/docs'
  });
});

// Health check through API
router.get('/health', healthController.getHealthStatus);

// Supermarket routes
router.get('/supermarkets', supermarketController.getSupermarkets);
router.get('/supermarkets/:id', supermarketController.getSupermarketById);

// Categories routes (placeholder for future implementation)
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    message: 'Categories endpoint - Coming soon',
    data: []
  });
});

// Products routes (placeholder for future implementation)
router.get('/products', (req, res) => {
  res.json({
    success: true,
    message: 'Products endpoint - Coming soon',
    data: []
  });
});

// 404 for API routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

module.exports = router;