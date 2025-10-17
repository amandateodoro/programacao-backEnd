const express = require('express');
const router = express.Router();
const authenticateMiddleware = require('../middleware/authMiddleware');
const { getUsuarios } = require('../controllers/usuariosController');

router.get('/', authenticateMiddleware, getUsuarios);

module.exports = router;
