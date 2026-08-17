const express = require('express');
const { body } = require('express-validator');
const { updateProfile, changePassword } = require('../controllers/profileController');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.put(
  '/',
  uploadAvatar,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional().isLength({ max: 280 }).withMessage('Bio cannot exceed 280 characters'),
  ],
  validate,
  updateProfile
);

router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changePassword
);

module.exports = router;
