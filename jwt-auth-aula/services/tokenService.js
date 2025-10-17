const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7', 10);

const refreshTokenStore = new Map(); // token → { userId, expiresAt, revoked }

function generateAccessToken(user) {
  const payload = { sub: user.id, nome: user.nome, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function generateRefreshToken(userId) {
  const token = crypto.randomBytes(64).toString('hex');
  const now = Date.now();
  const expiresAt = now + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
  refreshTokenStore.set(token, { userId, expiresAt, revoked: false, createdAt: now });
  return { token, expiresAt };
}

function validateRefreshToken(token) {
  const meta = refreshTokenStore.get(token);
  if (!meta) return { valid: false, reason: 'not_found' };
  if (meta.revoked) return { valid: false, reason: 'revoked' };
  if (meta.expiresAt < Date.now()) {
    refreshTokenStore.delete(token);
    return { valid: false, reason: 'expired' };
  }
  return { valid: true, meta };
}

function revokeRefreshToken(token) {
  refreshTokenStore.delete(token);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  refreshTokenStore
};
