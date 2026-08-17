const express = require('express');
const { body } = require('express-validator');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} = require('../controllers/expenseController');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { EXPENSE_CATEGORIES, PAYMENT_METHODS } = require('../models/Expense');

const router = express.Router();

// Every route below requires a valid session — no anonymous expense access.
router.use(protect);

const expenseValidation = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').optional().isIn(EXPENSE_CATEGORIES).withMessage('Invalid category'),
  body('paymentMethod').optional().isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
  body('date').optional({ nullable: true }).isISO8601().withMessage('date must be a valid date'),
];

// /stats must be declared before /:id so "stats" isn't parsed as an id.
router.get('/stats', getExpenseStats);

router.get('/', getExpenses);
router.post('/', expenseValidation, validate, createExpense);
router.get('/:id', getExpense);
router.put('/:id', expenseValidation, validate, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
