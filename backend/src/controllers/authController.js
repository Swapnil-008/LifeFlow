const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getAccessTokenMaxAge,
  getRefreshTokenExpiry,
  getRefreshTokenMaxAge,
} = require('../utils/generateToken');

const ACCESS_COOKIE_NAME = process.env.ACCESS_COOKIE_NAME || 'dailylife_access_token';
const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || 'dailylife_refresh_token';

const isProduction = process.env.NODE_ENV === 'production';

// Vercel frontend + Render API are cross-site in production, so the cookies
// must be SameSite=None + Secure. Locally both apps are on localhost, so Lax is enough.
const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

const accessCookieOptions = () => ({
  ...baseCookieOptions,
  path: '/api',
  maxAge: getAccessTokenMaxAge(),
});

const refreshCookieOptions = () => ({
  ...baseCookieOptions,
  path: '/api/auth',
  maxAge: getRefreshTokenMaxAge(),
});

const clearAccessCookieOptions = () => ({
  ...baseCookieOptions,
  path: '/api',
});

const clearRefreshCookieOptions = () => ({
  ...baseCookieOptions,
  path: '/api/auth',
});

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
});

const setAccessCookie = (res, userId) => {
  const accessToken = generateAccessToken(userId);
  res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions());
};

const issueSession = async (user, res) => {
  const refreshToken = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshTokenExpiry(),
  });

  setAccessCookie(res, user._id);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  await issueSession(user, res);

  res.status(201).json({
    success: true,
    user: toPublicUser(user),
  });
});

// @desc Log in an existing user
// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  user.lastActiveAt = new Date();
  await user.save();

  await issueSession(user, res);

  res.status(200).json({
    success: true,
    user: toPublicUser(user),
  });
});

// @desc Rotate the refresh token and issue a new short-lived access-token cookie
// @route POST /api/auth/refresh
// @access Public (refresh cookie required)
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    res.status(401);
    throw new Error('Refresh token missing');
  }

  const tokenHash = hashRefreshToken(refreshToken);
  const storedToken = await RefreshToken.findOne({ tokenHash });

  if (!storedToken || storedToken.expiresAt <= new Date()) {
    if (storedToken) await RefreshToken.deleteOne({ _id: storedToken._id });
    res.status(401);
    throw new Error('Refresh token expired or invalid');
  }

  const user = await User.findById(storedToken.user);
  if (!user) {
    await RefreshToken.deleteOne({ _id: storedToken._id });
    res.status(401);
    throw new Error('User no longer exists');
  }

  // Rotate: the token that was just used can never be used again.
  await RefreshToken.deleteOne({ _id: storedToken._id });
  await issueSession(user, res);

  res.status(200).json({
    success: true,
    user: toPublicUser(user),
  });
});

// @desc Log out the current session
// @route POST /api/auth/logout
// @access Public (refresh cookie optional)
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (refreshToken) {
    await RefreshToken.deleteOne({ tokenHash: hashRefreshToken(refreshToken) });
  }

  res.clearCookie(ACCESS_COOKIE_NAME, clearAccessCookieOptions());
  res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions());

  res.status(200).json({ success: true, message: 'Logged out' });
});

// @desc Get the currently authenticated user
// @route GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: toPublicUser(req.user) });
});

module.exports = { register, login, refresh, logout, getMe };
