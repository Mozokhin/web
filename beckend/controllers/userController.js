// backend/controllers/userController.js
const User = require('../models/User');

// Получение списка всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении списка пользователей'
    });
  }
};