const express = require('express');
const { body } = require('express-validator');
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleComplete,
} = require('../controllers/habitController');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { HABIT_FREQUENCIES } = require('../models/Habit');

const router = express.Router();

// Every route below requires a valid session — no anonymous habit access.
router.use(protect);

const habitValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('frequency').optional().isIn(HABIT_FREQUENCIES).withMessage('Invalid frequency'),
];

router.get('/', getHabits);
router.post('/', habitValidation, validate, createHabit);
router.get('/:id', getHabit);
router.put('/:id', habitValidation, validate, updateHabit);
router.delete('/:id', deleteHabit);
router.patch('/:id/complete', toggleComplete);

module.exports = router;
