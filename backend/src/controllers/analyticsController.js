const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Expense = require('../models/Expense');
const DailySummary = require('../models/DailySummary');
const Activity = require('../models/Activity');

const rangeFor = (period) => {
  const start = new Date();
  if (period === 'week') {
    const day = start.getDay();
    start.setDate(start.getDate() - ((day + 6) % 7));
  } else if (period === 'year') {
    start.setMonth(0, 1);
  } else {
    start.setDate(1);
  }
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const daysBetween = (start, end) =>
  Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;

const dayKey = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};

const buildDateKeys = (start, end) => {
  const keys = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    keys.push(dayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
};

// @desc    Cross-feature analytics overview
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  const safePeriod = ['week', 'month', 'year'].includes(period) ? period : 'month';
  const { start, end } = rangeFor(safePeriod);
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const numDays = daysBetween(start, end);
  const dateKeys = buildDateKeys(start, end);

  const [
    tasks,
    habits,
    expenseAgg,
    expenseTrend,
    expenseCategories,
    summaries,
    activityDays,
  ] = await Promise.all([
    Task.find({ userId: req.user.id, dueDate: { $gte: start, $lte: end } }).select('status dueDate'),
    Habit.find({ userId: req.user.id }).select('completedDates'),
    Expense.aggregate([
      { $match: { userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { userId, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Expense.aggregate([
      { $match: { userId, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { amount: -1 } },
    ]),
    DailySummary.find({ userId: req.user.id, date: { $gte: start, $lte: end } })
      .select('date mood rating')
      .sort({ date: 1 }),
    Activity.aggregate([
      { $match: { userId, date: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } } },
      { $count: 'activeDays' },
    ]),
  ]);

  const tasksCompleted = tasks.filter((t) => t.status === 'completed').length;

  const taskTrendMap = new Map(
    dateKeys.map((date) => [date, { date, completed: 0, total: 0 }])
  );
  tasks.forEach((task) => {
    const key = dayKey(task.dueDate);
    if (taskTrendMap.has(key)) {
      taskTrendMap.get(key).total += 1;
      if (task.status === 'completed') taskTrendMap.get(key).completed += 1;
    }
  });

  let habitCompletions = 0;
  const habitTrendMap = new Map(
    dateKeys.map((date) => [date, { date, completed: 0, possible: habits.length }])
  );

  habits.forEach((habit) => {
    habit.completedDates.forEach((date) => {
      const key = dayKey(date);
      if (key >= dayKey(start) && key <= dayKey(end)) {
        habitCompletions += 1;
        if (habitTrendMap.has(key)) habitTrendMap.get(key).completed += 1;
      }
    });
  });

  const habitTrend = Array.from(habitTrendMap.values()).map((item) => ({
    ...item,
    rate: item.possible ? Math.round((item.completed / item.possible) * 100) : 0,
  }));

  const ratings = summaries
    .filter((s) => s.rating != null)
    .map((s) => s.rating);
  const averageRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;

  const expenseTotal = expenseAgg[0]?.total || 0;
  const expenseTotalForPercent = expenseTotal || 1;

  res.status(200).json({
    success: true,
    period: safePeriod,
    startDate: start,
    endDate: end,
    tasks: {
      completed: tasksCompleted,
      total: tasks.length,
      completionRate: tasks.length ? Math.round((tasksCompleted / tasks.length) * 100) : 0,
      trend: Array.from(taskTrendMap.values()),
    },
    habits: {
      completions: habitCompletions,
      possible: habits.length * numDays,
      consistencyRate: habits.length
        ? Math.round((habitCompletions / (habits.length * numDays)) * 100)
        : 0,
      activeHabits: habits.length,
      trend: habitTrend,
    },
    expenses: {
      total: expenseTotal,
      trend: expenseTrend.map((d) => ({ date: d._id, amount: d.amount })),
      byCategory: expenseCategories.map((d) => ({
        category: d._id,
        amount: d.amount,
        percentage: Math.round((d.amount / expenseTotalForPercent) * 100),
      })),
    },
    mood: {
      trend: summaries.map((s) => ({
        date: s.date,
        mood: s.mood,
        rating: s.rating,
      })),
      averageRating,
      entriesLogged: summaries.length,
    },
    activity: {
      activeDays: activityDays[0]?.activeDays || 0,
      periodDays: numDays,
    },
  });
});

module.exports = { getOverview };
