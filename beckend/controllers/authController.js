// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Регистрация
exports.register = async (req, res) => {
  try {
    const { firstName, phone, login, password, confirmPassword } = req.body;

    // Валидация
    if (!firstName || !phone || !login || !password) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Пароль должен быть не менее 6 символов'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Пароли не совпадают'
      });
    }

    // Проверка уникальности логина и телефона
    const existingUserByLogin = await User.findByLogin(login);
    if (existingUserByLogin) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким логином уже существует'
      });
    }

    const existingUserByPhone = await User.findByPhone(phone);
    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким номером телефона уже существует'
      });
    }

    // Создание пользователя
    const user = await User.create({
      firstName,
      phone,
      login,
      password
    });

    // Генерация токена
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          phone: user.phone,
          login: user.login,
          createdAt: user.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при регистрации'
    });
  }
};

// Вход
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Валидация
    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: 'Логин и пароль обязательны'
      });
    }

    // Поиск пользователя
    const user = await User.findByLogin(login);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // Проверка пароля
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // Генерация токена
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          phone: user.phone,
          login: user.login,
          createdAt: user.created_at
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при входе'
    });
  }
};

// Получение профиля
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении профиля'
    });
  }
};