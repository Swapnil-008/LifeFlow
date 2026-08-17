const express = require('express');
const { body } = require('express-validator');
const { getSummaryByDate, getSummaries, createSummary, updateSummary } = require('../controllers/summaryController');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { MOODS } = require('../models/DailySummary');

const router = express.Router();

// Every route below requires a valid session — no anonymous summary access.
router.use(protect);

const summaryValidation = [
  body('mood').optional({ nullable: true }).isIn(MOODS).withMessage('Invalid mood'),
  body('rating').optional({ nullable: true }).isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('accomplishments').optional().isLength({ max: 2000 }),
  body('challenges').optional().isLength({ max: 2000 }),
  body('notes').optional().isLength({ max: 2000 }),
];

router.get('/', getSummaries);
router.post('/', [body('date').optional().isISO8601(), ...summaryValidation], validate, createSummary);
router.get('/:date', getSummaryByDate);
router.put('/:date', summaryValidation, validate, updateSummary);

module.exports = router;
