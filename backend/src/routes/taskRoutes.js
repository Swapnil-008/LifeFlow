const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateProgress,
  deleteTask,
  toggleComplete,
} = require('../controllers/taskController');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { TASK_CATEGORIES, TASK_PRIORITIES } = require('../models/Task');

const router = express.Router();

// Every route below requires a valid session — no anonymous task access.
router.use(protect);

const createTaskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').optional().isIn(TASK_CATEGORIES).withMessage('Invalid category'),
  body('priority').optional().isIn(TASK_PRIORITIES).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be a valid date'),
];

const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('category').optional().isIn(TASK_CATEGORIES).withMessage('Invalid category'),
  body('priority').optional().isIn(TASK_PRIORITIES).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be a valid date'),
];

const progressValidation = [
  body('progress').isFloat({ min: 0, max: 100 }).withMessage('progress must be a number between 0 and 100'),
];

router.get('/', getTasks);
router.post('/', createTaskValidation, validate, createTask);
router.get('/:id', getTask);
router.put('/:id', updateTaskValidation, validate, updateTask);
router.patch('/:id/progress', progressValidation, validate, updateProgress);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', toggleComplete);

module.exports = router;
