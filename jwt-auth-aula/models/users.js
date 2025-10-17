const bcrypt = require('bcryptjs');

const users = [
  { id: '1', nome: 'Amanda', email: 'amanda@example.com', role: 'admin', passwordHash: '$2a$10$...' },
  { id: '2', nome: 'Joao', email: 'joao@example.com', role: 'usuario', passwordHash: '$2a$10$...' }
];

module.exports = { users };
