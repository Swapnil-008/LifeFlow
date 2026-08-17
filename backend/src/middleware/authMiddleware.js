const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const ACCESS_COOKIE_NAME = process.env.ACCESS_COOKIE_NAME || 'dailylife_access_token';

const protect = asyncHandler(async (req, res, next) => {
  // Primary authentication mechanism: short-lived HttpOnly access-token cookie.
  let token = req.cookies?.[ACCESS_COOKIE_NAME];

  // Keep Bearer support for API tools/backward compatibility, but the frontend
  // no longer stores or sends the access token from JavaScript.
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, access token missing');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error(error.name === 'TokenExpiredError'
      ? 'Access token expired'
      : 'Not authorized, invalid access token');
  }

  if (decoded.type !== 'access') {
    res.status(401);
    throw new Error('Not authorized, invalid access token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { protect };
