const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const { deduplicateActivities } = require('../services/activityService');

/**
 * Connects to MongoDB using the URI from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Remove duplicates from older versions before building the new unique index.
    const removed = await deduplicateActivities();
    await Activity.syncIndexes();

    console.log(`MongoDB connected: ${conn.connection.host}`);
    if (removed) {
      console.log(`Activity cleanup: removed ${removed} duplicate record(s)`);
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
