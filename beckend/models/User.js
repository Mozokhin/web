// backend/models/User.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Создание нового пользователя
  static async create(userData) {
    const { firstName, phone, login, password } = userData;
    
    // Хешируем пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (first_name, phone, login, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, first_name, phone, login, created_at
    `;
    
    const values = [firstName, phone, login, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Поиск пользователя по логину
  static async findByLogin(login) {
    const query = 'SELECT * FROM users WHERE login = $1';
    const result = await pool.query(query, [login]);
    return result.rows[0];
  }

  // Поиск пользователя по телефону
  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  }

  // Проверка пароля
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Получение пользователя по ID
  static async findById(id) {
    const query = 'SELECT id, first_name, phone, login, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;