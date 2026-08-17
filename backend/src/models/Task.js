const mongoose = require('mongoose');

const TASK_CATEGORIES = ['Work', 'Study', 'Personal', 'Health', 'Errands', 'Other'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];
const TASK_STATUSES = ['pending', 'completed'];

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: TASK_CATEGORIES,
      default: 'Other',
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'medium',
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'pending',
      index: true,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    startTime: {
      type: String, // stored as "HH:mm"; keeping it a plain string avoids timezone-shift bugs for a display-only field
      default: null,
    },
    endTime: {
      type: String,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Keep status and progress synchronized for every save.
//
// Progress is the source of truth when it is explicitly changed:
//   0-99  -> pending
//   100   -> completed
// When a caller explicitly changes status (for example the checkbox),
// completion still forces progress to 100.
taskSchema.pre('validate', function syncProgress(next) {
  const progressWasChanged = this.isModified('progress');

  if (progressWasChanged) {
    if (this.progress >= 100) {
      this.progress = 100;
      this.status = 'completed';
      if (!this.completedAt) this.completedAt = new Date();
    } else {
      this.progress = Math.max(0, Number(this.progress) || 0);
      this.status = 'pending';
      this.completedAt = null;
    }
  } else if (this.status === 'completed') {
    this.progress = 100;
    if (!this.completedAt) this.completedAt = new Date();
  } else {
    this.status = 'pending';
    this.completedAt = null;
  }

  next();
});

// Frequent query: "this user's tasks due on this date"
taskSchema.index({ userId: 1, dueDate: 1 });
// Frequent query: "this user's tasks by status" (Today's Tasks / Completed views)
taskSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
module.exports.TASK_CATEGORIES = TASK_CATEGORIES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;
module.exports.TASK_STATUSES = TASK_STATUSES;
