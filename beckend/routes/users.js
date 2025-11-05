// backend/routes/users.js
const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Получить список всех пользователей (защищено авторизацией)
router.get('/', auth, getAllUsers);

module.exports = router;