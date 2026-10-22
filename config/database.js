const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  // If already connected, return active connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  let uri = process.env.MONGODB_URI;

  // In Vercel serverless environment:
  if (process.env.VERCEL) {
    if (!uri || uri.trim() === '' || uri.includes('127.0.0.1')) {
      console.warn('[Vercel DB Warning]: MONGODB_URI is not set in Vercel environment variables. Please provide a MongoDB Atlas connection string in your Vercel Project Settings.');
      return null;
    }
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false
      });
      console.log(`[MongoDB Connected on Vercel]: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('[MongoDB Vercel Connection Error]:', err.message);
      return null;
    }
  }

  // Local development environment
  uri = uri || 'mongodb://127.0.0.1:27017/lti_courses';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log(`[Database Notice]: Unable to connect to ${uri}. Starting MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      uri = mongoMemoryServer.getUri();
      process.env.MONGODB_URI = uri;
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Memory Server Connected]: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB Fallback Warning]: Could not start MongoMemoryServer. Make sure MongoDB Atlas URI is set in .env`);
      return null;
    }
  }
};

module.exports = connectDB;
