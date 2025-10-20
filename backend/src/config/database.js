const mongoose = require('mongoose');

// Global database connections object
const databaseConnections = {};

// Connection options for better performance and reliability
const connectionOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
};

// Initialize database connections
const initializeDatabaseConnections = async () => {
  try {
    // Admin Database Connection (Users, Sessions, Carts, Addresses)
    if (process.env.MONGO_ADMIN_URI) {
      databaseConnections.admin = await mongoose.createConnection(
        process.env.MONGO_ADMIN_URI,
        connectionOptions
      );
      console.log('✅ Connected to Admin Database');
    }

    // Operations Database Connection (Orders, Price History, Logs, Settings)
    if (process.env.MONGO_OPERATIONS_URI) {
      databaseConnections.operations = await mongoose.createConnection(
        process.env.MONGO_OPERATIONS_URI,
        connectionOptions
      );
      console.log('✅ Connected to Operations Database');
    }

    // Caminando-Online Database Connection (Normalized data for frontend)
    if (process.env.MONGO_CAMINANDO_URI) {
      databaseConnections.caminandoOnline = await mongoose.createConnection(
        process.env.MONGO_CAMINANDO_URI,
        connectionOptions
      );
      console.log('✅ Connected to Caminando-Online Database');
    }

    // Raw Databases Connections (Scraping data per supermarket)
    const rawDatabases = [
      { name: 'carrefour', uri: process.env.MONGO_CARREFOUR_URI },
      { name: 'dia', uri: process.env.MONGO_DIA_URI },
      { name: 'jumbo', uri: process.env.MONGO_JUMBO_URI },
      { name: 'vea', uri: process.env.MONGO_VEA_URI },
      { name: 'disco', uri: process.env.MONGO_DISCO_URI }
    ];

    for (const db of rawDatabases) {
      if (db.uri) {
        databaseConnections[db.name] = await mongoose.createConnection(
          db.uri,
          connectionOptions
        );
        console.log(`✅ Connected to ${db.name.charAt(0).toUpperCase() + db.name.slice(1)} Raw Database`);
      }
    }

    console.log('🎉 All database connections established successfully');
    return databaseConnections;

  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

// Get specific database connection
const getDatabaseConnection = (databaseName) => {
  const connection = databaseConnections[databaseName];
  if (!connection) {
    throw new Error(`Database connection '${databaseName}' not found`);
  }
  return connection;
};

// Close all database connections
const closeDatabaseConnections = async () => {
  try {
    for (const [name, connection] of Object.entries(databaseConnections)) {
      await connection.close();
      console.log(`🔒 Closed connection to ${name} database`);
    }
    console.log('🎯 All database connections closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

// Health check for database connections
const checkDatabaseHealth = async () => {
  const healthStatus = {};

  for (const [name, connection] of Object.entries(databaseConnections)) {
    try {
      await connection.db.admin().ping();
      healthStatus[name] = 'healthy';
    } catch (error) {
      healthStatus[name] = 'unhealthy';
      console.error(`❌ Health check failed for ${name}:`, error.message);
    }
  }

  return healthStatus;
};

module.exports = {
  initializeDatabaseConnections,
  getDatabaseConnection,
  closeDatabaseConnections,
  checkDatabaseHealth,
  databaseConnections
};