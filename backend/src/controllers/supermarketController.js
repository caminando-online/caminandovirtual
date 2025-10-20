const { getDatabaseConnection } = require('../config/database');

// Supermarket controller
const getSupermarkets = async (req, res) => {
  try {
    // Get connection to caminando-online database
    const connection = getDatabaseConnection('caminandoOnline');

    // Get Supermarket model
    const Supermarket = connection.model('Supermarket') || connection.model('Supermarket', require('../models/Supermarket').schema);

    // Fetch all supermarkets
    const supermarkets = await Supermarket.find({}).sort({ name: 1 });

    res.json({
      success: true,
      data: supermarkets,
      count: supermarkets.length
    });

  } catch (error) {
    console.error('Get supermarkets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supermarkets',
      message: error.message
    });
  }
};

const getSupermarketById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get connection to caminando-online database
    const connection = getDatabaseConnection('caminandoOnline');

    // Get Supermarket model
    const Supermarket = connection.model('Supermarket') || connection.model('Supermarket', require('../models/Supermarket').schema);

    // Find supermarket by ID
    const supermarket = await Supermarket.findById(id);

    if (!supermarket) {
      return res.status(404).json({
        success: false,
        error: 'Supermarket not found',
        message: `No supermarket found with ID: ${id}`
      });
    }

    res.json({
      success: true,
      data: supermarket
    });

  } catch (error) {
    console.error('Get supermarket by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supermarket',
      message: error.message
    });
  }
};

module.exports = {
  getSupermarkets,
  getSupermarketById
};