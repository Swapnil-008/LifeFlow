const asyncHandler = require('express-async-handler');
const Activity = require('../models/Activity');
const { getHeatmapData } = require('../services/activityService');
const { ACTIVITY_TYPES } = require('../models/Activity');

// @desc    List the current user's recent activity (timeline)
// @route   GET /api/activity
// @access  Private
// Query params:
//   limit=<n>   default 20, max 100
//   type=task_completed|habit_completed|expense_created|summary_created
const getActivity = asyncHandler(async (req, res) => {
  const { limit = 20, type } = req.query;

  const query = { userId: req.user.id };
  if (type) {
    if (!ACTIVITY_TYPES.includes(type)) {
      res.status(400);
      throw new Error('Invalid activity type');
    }
    query.type = type;
  }

  const activities = await Activity.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 20, 100));

  res.status(200).json({ success: true, count: activities.length, activities });
});

// @desc    Day-by-day activity counts for the GitHub-style heatmap
// @route   GET /api/activity/heatmap
// @access  Private
// Query params:
//   days=<n>   default 365, clamped to [7, 365]
const getHeatmap = asyncHandler(async (req, res) => {
  const { days = 365 } = req.query;
  const clampedDays = Math.min(Math.max(Number(days) || 365, 7), 365);

  const heatmap = await getHeatmapData(req.user.id, clampedDays);

  res.status(200).json({ success: true, days: clampedDays, heatmap });
});

module.exports = { getActivity, getHeatmap };
