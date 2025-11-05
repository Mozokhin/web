// backend/routes/tasks.js
const express = require('express');
const {
  getTasks,
  createTask,
  updateTaskStatus,
  archiveTask
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// Все роуты для задач защищены middleware-ом auth
// Он проверяет наличие валидного JWT токена и добавляет userId в req

// GET /api/tasks - Получить все задачи пользователя
router.get('/', auth, getTasks);

// POST /api/tasks - Создать новую задачу
router.post('/', auth, createTask);

// PUT /api/tasks/:taskId/status - Обновить статус задачи
router.put('/:taskId/status', auth, updateTaskStatus);

// PUT /api/tasks/:taskId/archive - Архивировать задачу
router.put('/:taskId/archive', auth, archiveTask);


module.exports = router;