const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/uploadToCloudinary');

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
});

// @desc    Update the current user's profile and optional avatar
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const editable = ['name', 'bio'];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  if (req.file) {
    const previousPublicId = req.user.avatarPublicId;
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      public_id: `user_${req.user._id}`,
      overwrite: true,
    });

    req.user.avatar = result.secure_url;
    req.user.avatarPublicId = result.public_id;

    // The upload uses a stable public_id, so replacement is an overwrite.
    // Delete the previous asset only if it was stored under a different id.
    if (previousPublicId && previousPublicId !== result.public_id) {
      try {
        await deleteFromCloudinary(previousPublicId);
      } catch (error) {
        console.warn('Could not delete previous Cloudinary avatar:', error.message);
      }
    }
  }

  await req.user.save();
  res.status(200).json({ success: true, user: toPublicUser(req.user) });
});

// @desc    Change the current user's password
// @route   PUT /api/profile/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated' });
});

module.exports = { updateProfile, changePassword };
