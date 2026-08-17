const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

const parseDurationMs = (value) => {
  const match = String(value).trim().match(/^(\d+)\s*(s|m|h|d)$/i);
  if (!match) throw new Error('Token expiry must look like 15m, 2h, or 7d');

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multiplier = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit];
  return amount * multiplier;
};

const generateAccessToken = (userId) =>
  jwt.sign({ id: userId, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');

const hashRefreshToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const getAccessTokenMaxAge = () => parseDurationMs(ACCESS_TOKEN_EXPIRES_IN);

const getRefreshTokenExpiry = () =>
  new Date(Date.now() + parseDurationMs(REFRESH_TOKEN_EXPIRES_IN));

const getRefreshTokenMaxAge = () => parseDurationMs(REFRESH_TOKEN_EXPIRES_IN);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  getAccessTokenMaxAge,
  getRefreshTokenExpiry,
  getRefreshTokenMaxAge,
};
