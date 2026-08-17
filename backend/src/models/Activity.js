const mongoose = require('mongoose');

// Extensible on purpose — Phase 8 (Analytics) or later phases can add new
// event types without touching the schema shape.
const ACTIVITY_TYPES = ['task_completed', 'habit_completed', 'expense_created', 'summary_created'];

const ACTIVITY_REF_MODELS = ['Task', 'Habit', 'Expense', 'DailySummary'];

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: true,
    },
    // Denormalized, human-readable text so the timeline can render without
    // an extra populate/join per row — same reasoning as why habit streaks
    // are stored rather than recomputed on every read.
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    refModel: {
      type: String,
      enum: ACTIVITY_REF_MODELS,
      default: null,
    },
    // Normalized to UTC midnight — the calendar day this activity counts
    // towards for the heatmap/timeline grouping. Usually "now" at the time
    // of the action, except habit completions, which use the date the user
    // actually checked off (see habitController), so the heatmap reflects
    // the day the habit was done rather than the day it was toggled.
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true, autoIndex: false }
);

// Frequent query: "this user's activity, most recent first" (timeline)
activitySchema.index({ userId: 1, createdAt: -1 });
// Frequent query: "this user's activity grouped by day" (heatmap)
activitySchema.index({ userId: 1, date: 1 });

// A task/habit (or any other referenced entity) can contribute at most one
// activity record for a user on a given calendar day.
activitySchema.index(
  { userId: 1, type: 1, refId: 1, date: 1 },
  { unique: true, name: 'one_activity_per_item_per_day' }
);

module.exports = mongoose.model('Activity', activitySchema);
module.exports.ACTIVITY_TYPES = ACTIVITY_TYPES;
module.exports.ACTIVITY_REF_MODELS = ACTIVITY_REF_MODELS;
