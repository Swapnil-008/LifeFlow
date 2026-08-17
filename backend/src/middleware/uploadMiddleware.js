const multer = require('multer');

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed'));
  }
  cb(null, true);
};

const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter,
}).single('avatar');

module.exports = { uploadAvatar };
