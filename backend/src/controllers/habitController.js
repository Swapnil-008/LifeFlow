const asyncHandler = require('express-async-handler');
const Habit = require('../models/Habit');
const { normalizeDate, dateKey, computeStreaks, completionRate } = require('../services/habitService');
const { recordActivity } = require('../services/activityService');

/**
 * Loads a habit and verifies it belongs to the requesting user. Returns a
 * generic 404 (not a 403) on mismatch, same convention as taskController.
 */
const getOwnedHabitOr404 = async (habitId, userId) => Habit.findOne({ _id: habitId, userId });

// Shapes a habit document into what the frontend renders, adding derived
// (never stored) fields for "today" — read endpoints use the server clock
// for these, which is fine for display; the write path (toggleComplete)
// takes an explicit date instead, since that's what actually gets persisted.
const presentHabit = (habit) => {
  const obj = habit.toObject();
  const todayKey = dateKey(new Date());
  return {
    ...obj,
    completedToday: obj.completedDates.some((d) => dateKey(d) === todayKey),
    weeklyRate: completionRate(obj.completedDates, 7),
    monthlyRate: completionRate(obj.completedDates, 30),
  };
};

// @desc    List the current user's habits
// @route   GET /api/habits
// @access  Private
const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: 1 });
  res.status(200).json({ success: true, count: habits.length, habits: habits.map(presentHabit) });
});

// @desc    Get a single habit
// @route   GET /api/habits/:id
// @access  Private
const getHabit = asyncHandler(async (req, res) => {
  const habit = await getOwnedHabitOr404(req.params.id, req.user.id);
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }
  res.status(200).json({ success: true, habit: presentHabit(habit) });
});

// @desc    Create a habit
// @route   POST /api/habits
// @access  Private
const createHabit = asyncHandler(async (req, res) => {
  const { name, frequency } = req.body;
  const habit = await Habit.create({
    userId: req.user.id, // always derived from the token, never from req.body
    name,
    frequency,
  });
  res.status(201).json({ success: true, habit: presentHabit(habit) });
});

// @desc    Update a habit's name/frequency
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = asyncHandler(async (req, res) => {
  const habit = await getOwnedHabitOr404(req.params.id, req.user.id);
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  const editable = ['name', 'frequency'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) habit[field] = req.body[field];
  });

  await habit.save();
  res.status(200).json({ success: true, habit: presentHabit(habit) });
});

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await getOwnedHabitOr404(req.params.id, req.user.id);
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }
  await habit.deleteOne();
  res.status(200).json({ success: true, message: 'Habit deleted' });
});

// @desc    Toggle completion for a given date
// @route   PATCH /api/habits/:id/complete
// @access  Private
// Body: { date: 'YYYY-MM-DD' } — required. The frontend always sends its
// own local "today" (see utils/mood.js#toDateKey) rather than letting the
// server infer it, so a user's check-in lands on the correct calendar day
// regardless of server timezone.
const toggleComplete = asyncHandler(async (req, res) => {
  const habit = await getOwnedHabitOr404(req.params.id, req.user.id);
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  const raw = req.body.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw || '')) {
    res.status(400);
    throw new Error('date is required and must be in YYYY-MM-DD format');
  }
  const target = normalizeDate(`${raw}T00:00:00.000Z`);
  const targetKey = dateKey(target);

  const wasCompleted = habit.completedDates.some((d) => dateKey(d) === targetKey);
  habit.completedDates = wasCompleted
    ? habit.completedDates.filter((d) => dateKey(d) !== targetKey)
    : [...habit.completedDates, target];

  const { currentStreak, longestStreak } = computeStreaks(habit.completedDates, target);
  habit.currentStreak = currentStreak;
  // Longest streak is a personal best — it can grow, but unmarking a past
  // day (undoing a mistake) shouldn't retroactively erase a record the
  // user already earned.
  habit.longestStreak = Math.max(habit.longestStreak, longestStreak);

  await habit.save();

  // Only log when marking done, not when undoing a check-in. Uses the
  // toggled date (the day the user actually did it), matching how
  // completedDates itself is keyed, not the server's current time.
  if (!wasCompleted) {
    await recordActivity(req.user.id, {
      type: 'habit_completed',
      title: `Completed habit: ${habit.name}`,
      refId: habit._id,
      refModel: 'Habit',
      date: target,
    });
  }

  res.status(200).json({ success: true, habit: presentHabit(habit) });
});

module.exports = { getHabits, getHabit, createHabit, updateHabit, deleteHabit, toggleComplete };
