require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
