const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const DailySummary = require('../models/DailySummary');
const Task = require('../models/Task');
const Expense = require('../models/Expense');
const Habit = require('../models/Habit');
const { recordActivity } = require('../services/activityService');

/**
 * Parses a "YYYY-MM-DD" route param into a normalized UTC-midnight Date,
 * and rejects anything that isn't a valid calendar date. Every summary is
 * stored and looked up at this exact normalized value.
 */
const parseDateParam = (raw) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw || '')) return null;
  const date = new Date(`${raw}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const dayRange = (date) => {
  const start = new Date(date);
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * Tasks-completed/total, habits-completed/total, and money-spent for a
 * given day, computed live from the underlying collections. This is what
 * backs the read-only stats shown at the top of the reflection form —
 * never stored on the summary itself, per the spec's "don't duplicate
 * dashboard/analytics data" rule.
 */
const computeDailyStats = async (userId, date) => {
  const { start, end } = dayRange(date);
  const targetKey = date.toISOString().slice(0, 10);

  const [tasks, expenseAgg, habits] = await Promise.all([
    Task.find({ userId, dueDate: { $gte: start, $lte: end } }).select('status'),
    Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Habit.find({ userId }).select('completedDates'),
  ]);

  return {
    tasksCompleted: tasks.filter((t) => t.status === 'completed').length,
    tasksTotal: tasks.length,
    habitsCompleted: habits.filter((h) => h.completedDates.some((d) => d.toISOString().slice(0, 10) === targetKey))
      .length,
    habitsTotal: habits.length,
    moneySpent: expenseAgg[0]?.total || 0,
  };
};

// @desc    Get the summary for a given date (plus that day's computed stats)
// @route   GET /api/summaries/:date
// @access  Private
const getSummaryByDate = asyncHandler(async (req, res) => {
  const date = parseDateParam(req.params.date);
  if (!date) {
    res.status(400);
    throw new Error('date must be in YYYY-MM-DD format');
  }

  const [summary, dailyStats] = await Promise.all([
    DailySummary.findOne({ userId: req.user.id, date }),
    computeDailyStats(req.user.id, date),
  ]);

  res.status(200).json({ success: true, summary: summary || null, dailyStats });
});

// @desc    List the current user's summaries (most recent first), for a history view
// @route   GET /api/summaries
// @access  Private
const getSummaries = asyncHandler(async (req, res) => {
  const { limit = 30 } = req.query;
  const summaries = await DailySummary.find({ userId: req.user.id })
    .sort({ date: -1 })
    .limit(Math.min(Number(limit) || 30, 100));

  res.status(200).json({ success: true, count: summaries.length, summaries });
});

// @desc    Create today's (or any date's) summary
// @route   POST /api/summaries
// @access  Private
const createSummary = asyncHandler(async (req, res) => {
  const { date: rawDate, accomplishments, challenges, notes, mood, rating } = req.body;

  const date = parseDateParam(rawDate) || parseDateParam(new Date().toISOString().slice(0, 10));

  const existing = await DailySummary.findOne({ userId: req.user.id, date });
  if (existing) {
    res.status(409);
    throw new Error('A summary already exists for this date — update it instead');
  }

  const summary = await DailySummary.create({
    userId: req.user.id, // always derived from the token, never from req.body
    date,
    accomplishments,
    challenges,
    notes,
    mood,
    rating,
  });

  // Uses the summary's own date (the day being reflected on), not the
  // server's current time, so writing about a past day lands correctly
  // on the heatmap/timeline instead of always showing as "today".
  await recordActivity(req.user.id, {
    type: 'summary_created',
    title: 'Wrote a daily reflection',
    description: mood ? `Mood: ${mood}` : '',
    refId: summary._id,
    refModel: 'DailySummary',
    date: summary.date,
  });

  res.status(201).json({ success: true, summary });
});

// @desc    Update the summary for a given date
// @route   PUT /api/summaries/:date
// @access  Private
const updateSummary = asyncHandler(async (req, res) => {
  const date = parseDateParam(req.params.date);
  if (!date) {
    res.status(400);
    throw new Error('date must be in YYYY-MM-DD format');
  }

  const summary = await DailySummary.findOne({ userId: req.user.id, date });
  if (!summary) {
    res.status(404);
    throw new Error('No summary exists for this date yet — create one first');
  }

  const editable = ['accomplishments', 'challenges', 'notes', 'mood', 'rating'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) summary[field] = req.body[field];
  });

  await summary.save();
  res.status(200).json({ success: true, summary });
});

module.exports = { getSummaryByDate, getSummaries, createSummary, updateSummary };
