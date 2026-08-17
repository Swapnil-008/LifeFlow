const { validationResult } = require('express-validator');

/**
 * Runs after a route's express-validator chain. Collects any validation
 * failures into a single 400 response instead of letting bad data reach
 * the controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new Error(message);
  }
  next();
};

module.exports = { validate };
