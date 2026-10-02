const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lti_courses';

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
    }
  }
};

module.exports = connectDB;
