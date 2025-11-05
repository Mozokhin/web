// backend/models/Task.js
const pool = require('../config/database');

class Task {
  /**
   * Создание новой задачи
   * @param {object} taskData - Данные задачи { title, description, dueDate, creatorId, assigneeId }
   */
  static async create(taskData) {
    const { title, description, dueDate, creatorId, assigneeId } = taskData;
    
    const query = `
      INSERT INTO tasks (title, description, due_date, creator_id, assignee_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    // dueDate и assigneeId могут быть null
    const values = [title, description || null, dueDate || null, creatorId, assigneeId || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Поиск всех активных (неархивированных) задач для пользователя (и созданных им, и назначенных ему)
   * @param {number} userId - ID пользователя
   */
  static async findAllByUserId(userId) {
    const query = `
      SELECT 
        t.id, t.title, t.description, t.status, t.due_date, t.is_archived,
        t.creator_id, uc.first_name as creator_name,
        t.assignee_id, ua.first_name as assignee_name
      FROM tasks t
      JOIN users uc ON t.creator_id = uc.id
      LEFT JOIN users ua ON t.assignee_id = ua.id
      WHERE (t.creator_id = $1 OR t.assignee_id = $1) AND t.is_archived = FALSE
      ORDER BY t.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Обновление статуса задачи
   * @param {number} taskId - ID задачи
   * @param {string} status - Новый статус ('todo', 'in_progress', 'done')
   */
  static async updateStatus(taskId, status) {
    const query = `
      UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *;
    `;
    const result = await pool.query(query, [status, taskId]);
    return result.rows[0];
  }

  /**
   * Архивирование задачи
   * @param {number} taskId - ID задачи
   */
  static async archiveById(taskId) {
    const query = `
      UPDATE tasks SET is_archived = TRUE WHERE id = $1 RETURNING id;
    `;
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
  }

  /**
   * Поиск задачи по ID
   * @param {number} taskId - ID задачи
   */
  static async findById(taskId) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
  }
}

module.exports = Task;