const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');
const { recordActivity } = require('../services/activityService');

/**
 * Loads an expense and verifies it belongs to the requesting user.
 * Returns a generic 404 (not a 403) on mismatch, same reasoning as
 * taskController's getOwnedTaskOr404 — don't let a client distinguish
 * "not yours" from "doesn't exist".
 */
const getOwnedExpenseOr404 = async (expenseId, userId) => {
  const expense = await Expense.findOne({ _id: expenseId, userId });
  return expense;
};

// Shared day/week/month range helper, mirrors taskController's view=today logic.
const rangeFor = (view) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (view === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (view === 'week') {
    const day = start.getDay(); // 0 = Sunday
    const diffToMonday = (day + 6) % 7;
    start.setDate(start.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);
  } else if (view === 'month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else {
    return null;
  }
  return { start, end };
};

// @desc    List the current user's expenses, with optional filters/search/sort
// @route   GET /api/expenses
// @access  Private
// Query params:
//   category=Food|Travel|...
//   paymentMethod=Cash|UPI|Card|Other
//   view=today|week|month          (convenience date-range filters)
//   startDate&endDate=ISO date     (explicit range, overrides view)
//   search=<text>                  (matches description, case-insensitive)
//   sort=date|-date|amount|-amount|createdAt|-createdAt (default: -date)
const getExpenses = asyncHandler(async (req, res) => {
  const { category, paymentMethod, view, startDate, endDate, search, sort } = req.query;

  const query = { userId: req.user.id };

  if (category) query.category = category;
  if (paymentMethod) query.paymentMethod = paymentMethod;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  } else if (view) {
    const range = rangeFor(view);
    if (range) query.date = { $gte: range.start, $lte: range.end };
  }

  if (search) {
    query.description = { $regex: search, $options: 'i' };
  }

  const sortMap = {
    date: { date: 1 },
    '-date': { date: -1 },
    amount: { amount: 1 },
    '-amount': { amount: -1 },
    createdAt: { createdAt: 1 },
    '-createdAt': { createdAt: -1 },
  };
  const sortOption = sortMap[sort] || { date: -1 };

  const expenses = await Expense.find(query).sort(sortOption);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  res.status(200).json({ success: true, count: expenses.length, total, expenses });
});

// @desc    Get a single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = asyncHandler(async (req, res) => {
  const expense = await getOwnedExpenseOr404(req.params.id, req.user.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.status(200).json({ success: true, expense });
});

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, description, paymentMethod, date } = req.body;

  const expense = await Expense.create({
    userId: req.user.id, // always derived from the token, never from req.body
    amount,
    category,
    description,
    paymentMethod,
    date: date || Date.now(),
  });

  await recordActivity(req.user.id, {
    type: 'expense_created',
    title: `Logged an expense: ${expense.category}`,
    description: `₹${expense.amount}${expense.description ? ` — ${expense.description}` : ''}`,
    refId: expense._id,
    refModel: 'Expense',
  });

  res.status(201).json({ success: true, expense });
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await getOwnedExpenseOr404(req.params.id, req.user.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const editable = ['amount', 'category', 'description', 'paymentMethod', 'date'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) expense[field] = req.body[field];
  });

  await expense.save();
  res.status(200).json({ success: true, expense });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await getOwnedExpenseOr404(req.params.id, req.user.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  await expense.deleteOne();
  res.status(200).json({ success: true, message: 'Expense deleted' });
});

// @desc    Category breakdown + daily spending trend for a period, for the
//          Expenses page's own charts (full cross-feature Analytics arrives
//          in Phase 8 and will reuse this same aggregation shape).
// @route   GET /api/expenses/stats
// @access  Private
// Query params:
//   period=week|month|year (default: month)
const getExpenseStats = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;

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

  const match = {
    // Aggregation pipelines don't auto-cast query args the way Mongoose's
    // find() does, so the ObjectId cast has to happen explicitly here.
    userId: new mongoose.Types.ObjectId(req.user.id),
    date: { $gte: start, $lte: end },
  };

  const [byCategory, byDay, totalAgg] = await Promise.all([
    Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $sort: { amount: -1 } },
    ]),
    Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Expense.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  const total = totalAgg[0]?.total || 0;

  res.status(200).json({
    success: true,
    period,
    startDate: start,
    endDate: end,
    total,
    byCategory: byCategory.map((c) => ({
      category: c._id,
      amount: c.amount,
      percentage: total > 0 ? Math.round((c.amount / total) * 100) : 0,
    })),
    trend: byDay.map((d) => ({ date: d._id, amount: d.amount })),
  });
});

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
};
