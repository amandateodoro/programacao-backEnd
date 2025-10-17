const { users } = require('../models/users');

function getUsuarios(req, res) {
  if (req.user.role === 'admin') return res.json({ message: 'Usuário admin', users });
  return res.json({ message: 'Usuário comum', user: { id: req.user.sub, nome: req.user.nome, role: req.user.role } });
}

module.exports = { getUsuarios };
