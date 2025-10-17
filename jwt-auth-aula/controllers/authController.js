const bcrypt = require('bcryptjs');
const { users } = require('../models/users');
const { generateAccessToken, generateRefreshToken, validateRefreshToken, revokeRefreshToken } = require('../services/tokenService');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

  const accessToken = generateAccessToken(user);
  const refresh = generateRefreshToken(user.id);

  return res.json({
    accessToken,
    refreshToken: refresh.token,
    refreshExpiresAt: new Date(refresh.expiresAt).toISOString()
  });
}

function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken é obrigatório' });

  const check = validateRefreshToken(refreshToken);
  if (!check.valid) return res.status(401).json({ error: 'Refresh token inválido: ' + check.reason });

  const userId = check.meta.userId;
  revokeRefreshToken(refreshToken);
  const newRefresh = generateRefreshToken(userId);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  const newAccessToken = generateAccessToken(user);
  return res.json({
    accessToken: newAccessToken,
    refreshToken: newRefresh.token,
    refreshExpiresAt: new Date(newRefresh.expiresAt).toISOString()
  });
}

function logout(req, res) {
  const { refreshToken } = req.body;
  if (refreshToken) revokeRefreshToken(refreshToken);
  return res.json({ message: 'Logout realizado (refresh token revogado)' });
}

module.exports = { login, refresh, logout };
