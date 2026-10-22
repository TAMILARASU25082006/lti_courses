require('dotenv').config();
const connectDB = require('../config/database');
const seedDataHelper = require('./seedDataHelper');
const mongoose = require('mongoose');

const run = async () => {
  try {
    await connectDB();
    await seedDataHelper();
    console.log('✔ Database seed finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed script error:', err);
    process.exit(1);
  }
};

run();
