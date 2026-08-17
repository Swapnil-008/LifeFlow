const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const { recordActivity } = require('../services/activityService');

/**
 * Loads a task and verifies it belongs to the requesting user.
 * Returns a generic 404 (not a 403) on mismatch so a client can't use the
 * response to probe which task ids exist for other users.
 */
const getOwnedTaskOr404 = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  return task;
};

// @desc    List the current user's tasks, with optional filters/search/sort
// @route   GET /api/tasks
// @access  Private
// Query params:
//   status=pending|completed
//   category=Work|Study|...
//   priority=low|medium|high
//   view=today|upcoming|completed   (convenience filters used by the dashboard/pages)
//   search=<text>                   (matches title, case-insensitive)
//   sort=dueDate|-dueDate|priority|-priority|createdAt|-createdAt (default: -createdAt)
const getTasks = asyncHandler(async (req, res) => {
  const { status, category, priority, view, search, sort } = req.query;

  const query = { userId: req.user.id };

  if (status) query.status = status;
  if (category) query.category = category;
  if (priority) query.priority = priority;

  if (view === 'today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    query.dueDate = { $gte: start, $lte: end };
  } else if (view === 'upcoming') {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    query.dueDate = { $gt: end };
    query.status = 'pending';
  } else if (view === 'completed') {
    query.status = 'completed';
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Whitelist sortable fields so req.query.sort can't be used to sort on
  // arbitrary/unindexed fields.
  const sortMap = {
    dueDate: { dueDate: 1 },
    '-dueDate': { dueDate: -1 },
    priority: { priority: 1 },
    '-priority': { priority: -1 },
    createdAt: { createdAt: 1 },
    '-createdAt': { createdAt: -1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const tasks = await Task.find(query).sort(sortOption);

  res.status(200).json({ success: true, count: tasks.length, tasks });
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await getOwnedTaskOr404(req.params.id, req.user.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ success: true, task });
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, category, priority, dueDate, startTime, endTime, progress } = req.body;

  const task = await Task.create({
    userId: req.user.id, // always derived from the token, never from req.body
    title,
    description,
    category,
    priority,
    dueDate,
    startTime,
    endTime,
    progress: progress === undefined ? 0 : progress,
  });

  res.status(201).json({ success: true, task });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await getOwnedTaskOr404(req.params.id, req.user.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const wasCompleted = task.status === 'completed';

  const editable = ['title', 'description', 'category', 'priority', 'dueDate', 'startTime', 'endTime', 'status', 'progress'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  if (req.body.progress !== undefined) {
    const progress = Math.max(0, Math.min(100, Number(req.body.progress)));
    task.progress = progress;
    task.status = progress >= 100 ? 'completed' : 'pending';
    task.completedAt = progress >= 100 ? (task.completedAt || new Date()) : null;
  } else if (req.body.status !== undefined) {
    task.status = req.body.status;
    if (task.status === 'completed') {
      task.progress = 100;
      task.completedAt = task.completedAt || new Date();
    } else {
      task.progress = 0;
      task.completedAt = null;
    }
  }

  await task.save();

  if (!wasCompleted && task.status === 'completed') {
    await recordActivity(req.user.id, {
      type: 'task_completed',
      title: `Completed task: ${task.title}`,
      refId: task._id,
      refModel: 'Task',
    });
  }

  res.status(200).json({ success: true, task });
});

// @desc    Update only task progress
// @route   PATCH /api/tasks/:id/progress
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
  const task = await getOwnedTaskOr404(req.params.id, req.user.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const progress = Number(req.body.progress);
  if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
    res.status(400);
    throw new Error('progress must be a number between 0 and 100');
  }

  const wasCompleted = task.status === 'completed';

  task.progress = Math.round(progress);
  if (task.progress >= 100) {
    task.progress = 100;
    task.status = 'completed';
    task.completedAt = task.completedAt || new Date();
  } else {
    task.status = 'pending';
    task.completedAt = null;
  }

  await task.save();

  if (!wasCompleted && task.status === 'completed') {
    await recordActivity(req.user.id, {
      type: 'task_completed',
      title: `Completed task: ${task.title}`,
      refId: task._id,
      refModel: 'Task',
    });
  }

  res.status(200).json({ success: true, task });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await getOwnedTaskOr404(req.params.id, req.user.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await task.deleteOne();
  res.status(200).json({ success: true, message: 'Task deleted' });
});

// @desc    Toggle a task's completion status
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const toggleComplete = asyncHandler(async (req, res) => {
  const task = await getOwnedTaskOr404(req.params.id, req.user.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const wasCompleted = task.status === 'completed';

  if (wasCompleted) {
    task.status = 'pending';
    task.progress = 0;
    task.completedAt = null;
  } else {
    task.status = 'completed';
    task.progress = 100;
    task.completedAt = new Date();
  }

  await task.save();

  // Only log when completing, not when undoing a completion.
  if (!wasCompleted) {
    await recordActivity(req.user.id, {
      type: 'task_completed',
      title: `Completed task: ${task.title}`,
      refId: task._id,
      refModel: 'Task',
    });
  }

  res.status(200).json({ success: true, task });
});

module.exports = { getTasks, getTask, createTask, updateTask, updateProgress, deleteTask, toggleComplete };
