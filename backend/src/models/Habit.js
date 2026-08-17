const mongoose = require('mongoose');

// Only 'daily' for now — the schema/API are shaped so weekly/custom
// cadences can be added later without a breaking change.
const HABIT_FREQUENCIES = ['daily'];

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    frequency: {
      type: String,
      enum: HABIT_FREQUENCIES,
      default: 'daily',
    },
    // One UTC-midnight Date per day the habit was completed. This is the
    // source of truth — currentStreak/longestStreak below are derived from
    // it and kept in sync on every toggle rather than recomputed on every
    // read, so list views stay cheap.
    completedDates: {
      type: [Date],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Frequent query: "this user's habits, oldest first" (habit list/dashboard)
habitSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model('Habit', habitSchema);
module.exports.HABIT_FREQUENCIES = HABIT_FREQUENCIES;
