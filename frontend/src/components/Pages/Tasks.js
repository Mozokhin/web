// frontend/src/components/Pages/Tasks.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import TaskColumn from '../Tasks/TaskColumn';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // <--- НОВОЕ: состояние для списка пользователей
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigneeId: '' });
  const navigate = useNavigate();

  // Загрузка задач и пользователей при первом рендере
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Запускаем оба запроса параллельно
        const [tasksResult, usersResult] = await Promise.all([
          apiService.getTasks(),
          apiService.getAllUsers()
        ]);

        if (tasksResult.success) {
          setTasks(tasksResult.data.tasks);
        }
        if (usersResult.success) {
          setUsers(usersResult.data.users);
        }
      } catch (err) {
        setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ... (handleDragStart, handleDragOver, handleDrop без изменений)
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    
    const taskToMove = tasks.find(t => t.id.toString() === taskId);
    if (taskToMove && taskToMove.status !== newStatus) {
      const updatedTasks = tasks.map(t => 
        t.id.toString() === taskId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);

      try {
        await apiService.updateTaskStatus(taskId, newStatus);
      } catch (err) {
        setError('Ошибка при обновлении статуса задачи.');
        setTasks(tasks);
      }
    }
  };


  // Функции для модального окна
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewTask({ title: '', description: '', assigneeId: '' });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      // Отправляем assigneeId, если он выбран, иначе он будет null/undefined
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        assigneeId: newTask.assigneeId || null,
      };

      const result = await apiService.createTask(taskData);
      
      if (result.success) {
        // Чтобы сразу видеть имя исполнителя, найдем его в нашем списке
        const assignee = users.find(u => u.id === result.data.task.assignee_id);
        const newTaskWithAssignee = {
            ...result.data.task,
            assignee_name: assignee ? assignee.first_name : null
        };

        setTasks(prevTasks => [newTaskWithAssignee, ...prevTasks]);
        handleCloseModal();
      }
    } catch (err) {
      setError('Не удалось создать задачу.');
      console.error(err);
    }
  };
  
  // ... (handleArchiveDoneTasks без изменений)
  const handleArchiveDoneTasks = async () => {
    const doneTasks = tasks.filter(t => t.status === 'done');
    if (doneTasks.length === 0) return;

    if (!window.confirm(`Вы уверены, что хотите архивировать ${doneTasks.length} выполненных задач?`)) {
        return;
    }

    try {
      await Promise.all(doneTasks.map(task => apiService.archiveTask(task.id)));
      setTasks(prevTasks => prevTasks.filter(t => t.status !== 'done'));
    } catch (err) {
        setError('Ошибка при архивации задач.');
        console.error(err);
    }
  };

  // Фильтрация задач по колонкам
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <>
      <Container fluid className="tasks-container">
        {/* ... (хедер с кнопками без изменений) */}
        <div className="tasks-header text-center">
          <h1 className="tasks-title">📋 Доска задач</h1>
          <div className="task-actions">
            <Button variant="light" onClick={handleShowModal} className="action-btn">
              ✨ Добавить задачу
            </Button>
            <Button variant="outline-light" onClick={handleArchiveDoneTasks} className="action-btn">
              📦 Отправить в архив
            </Button>
            <Button variant="outline-light" onClick={() => navigate('/archive')} className="action-btn">
              🗄️ Открыть архив
            </Button>
          </div>
        </div>

        {loading && <div className="text-center"><Spinner animation="border" variant="light" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Row className="task-board">
            {/* ... (колонки без изменений) */}
            <Col md={4}><TaskColumn title="Созданные" tasks={todoTasks} status="todo" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}/></Col>
            <Col md={4}><TaskColumn title="В работе" tasks={inProgressTasks} status="in_progress" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}/></Col>
            <Col md={4}><TaskColumn title="Сделанные" tasks={doneTasks} status="done" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}/></Col>
          </Row>
        )}
      </Container>

      {/* Модальное окно для создания задачи */}
      <Modal show={showModal} onHide={handleCloseModal} centered className="task-modal">
        <Modal.Header closeButton>
          <Modal.Title>Новая задача</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTask}>
            <Form.Group className="mb-3">
              <Form.Label>Название задачи</Form.Label>
              <Form.Control type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Что нужно сделать?" required autoFocus />
            </Form.Group>
            
            <Form.Group className="mb-3"> {/* <--- НОВЫЙ БЛОК --- */}
              <Form.Label>Назначить исполнителя</Form.Label>
              <Form.Select
                value={newTask.assigneeId}
                onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
              >
                <option value="">Не назначен</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.first_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" rows={3} value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Добавьте детали (необязательно)" />
            </Form.Group>
            
            <div className="d-grid mt-4">
              <Button variant="primary" type="submit">Создать задачу</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Tasks;