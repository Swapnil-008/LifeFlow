const mongoose = require('mongoose');

const MOODS = ['terrible', 'bad', 'okay', 'good', 'amazing'];

const dailySummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Always normalized to midnight (see summaryController's normalizeDate)
    // so "one summary per user per day" can be enforced with a plain
    // equality index instead of a range query.
    date: {
      type: Date,
      required: true,
    },
    accomplishments: {
      type: String,
      default: '',
      maxlength: [2000, 'Accomplishments cannot exceed 2000 characters'],
    },
    challenges: {
      type: String,
      default: '',
      maxlength: [2000, 'Challenges cannot exceed 2000 characters'],
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    mood: {
      type: String,
      enum: MOODS,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  { timestamps: true }
);

// Enforces "one summary per user per date" at the database level too —
// defense in depth alongside the controller's own existence check.
dailySummarySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailySummary', dailySummarySchema);
module.exports.MOODS = MOODS;
