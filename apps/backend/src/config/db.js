// src/config/db.js
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

// Sleep utility for retry delay
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Connect to MongoDB with optional retry logic for transient errors.
 * @param {Object} options
 * @param {number} options.retries - Number of retries (default Infinity)
 * @param {number} options.delayMs - Delay between retries in ms (default 3000)
 */
async function connectDB({ retries = Infinity, delayMs = 3000 } = {}) {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGO_URI is not set in your .env file');

  const dbName = process.env.MONGO_DB_NAME || 'EcoCollectDB';
  const options = {
    dbName,
    serverSelectionTimeoutMS: 5000,
    family: 4, // prefer IPv4
  };

  while (true) {
    try {
      await mongoose.connect(uri, options);
      console.log('✅ MongoDB connected:', mongoose.connection.host);

      // Event listeners
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected. Attempting reconnect...');
      });
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      return mongoose.connection;
    } catch (err) {
      const code = err && (err.code || err.name);
      const transient =
        code === 'ENOTFOUND' ||
        code === 'ETIMEDOUT' ||
        code === 'MongoServerSelectionError' ||
        /querySrv/i.test(String(err.message || ''));

      if (!transient || retries === 0) {
        console.error('❌ MongoDB connection error (fatal):', err.message || err);
        throw err;
      }

      if (retries !== Infinity) retries -= 1;
      console.warn(`⚠️ MongoDB connection failed, retrying in ${delayMs}ms... Reason:`, err.message);
      await sleep(delayMs);
    }
  }
}

module.exports = connectDB;
