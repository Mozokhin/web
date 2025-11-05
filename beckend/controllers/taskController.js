// backend/controllers/taskController.js
const Task = require('../models/Task');

// Получение всех задач пользователя
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAllByUserId(req.userId);
    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении задач'
    });
  }
};

// Создание новой задачи
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assigneeId } = req.body;
    const creatorId = req.userId;

    // Валидация
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Название задачи обязательно для заполнения'
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      creatorId,
      assigneeId
    });

    res.status(201).json({
      success: true,
      message: 'Задача успешно создана',
      data: { task }
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании задачи'
    });
  }
};

// Обновление статуса задачи
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    // Проверяем, что статус валидный
    const validStatuses = ['todo', 'in_progress', 'done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Неверный статус задачи' });
    }

    // Проверяем, что задача существует и пользователь имеет к ней доступ
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Задача не найдена' });
    }
    if (task.creator_id !== userId && task.assignee_id !== userId) {
      return res.status(403).json({ success: false, message: 'У вас нет прав для изменения этой задачи' });
    }

    const updatedTask = await Task.updateStatus(taskId, status);

    res.json({
      success: true,
      message: 'Статус задачи обновлен',
      data: { task: updatedTask }
    });

  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении статуса задачи'
    });
  }
};

// Архивирование задачи
exports.archiveTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.userId;

        // Проверяем, что задача существует и пользователь является ее создателем
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Задача не найдена' });
        }
        if (task.creator_id !== userId) {
            return res.status(403).json({ success: false, message: 'Только создатель может архивировать задачу' });
        }

        await Task.archiveById(taskId);

        res.json({
            success: true,
            message: 'Задача успешно заархивирована'
        });

    } catch (error) {
        console.error('Archive task error:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при архивировании задачи'
        });
    }
};