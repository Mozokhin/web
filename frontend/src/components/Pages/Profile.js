// frontend/src/components/Pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();

  // Данные для редактирования
  const [editForm, setEditForm] = useState({
    firstName: '',
    phone: '',
    login: ''
  });

  // Данные для смены пароля
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await apiService.getProfile();
      if (result.success) {
        setUser(result.data.user);
        // Исправляем: используем правильные поля из ответа API
        setEditForm({
          firstName: result.data.user.firstName || result.data.user.first_name || '',
          phone: result.data.user.phone || '',
          login: result.data.user.login || ''
        });
      }
    } catch (error) {
      setError(error.message);
      if (error.message.includes('token') || error.message.includes('Токен')) {
        setTimeout(() => navigate('/'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.removeToken();
    navigate('/');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    
    try {
      // Здесь будет вызов API для обновления профиля
      console.log('Обновление профиля:', editForm);
      
      // Имитация успешного обновления
      setTimeout(() => {
        setUser(prev => ({
          ...prev,
          firstName: editForm.firstName,
          phone: editForm.phone,
          login: editForm.login
        }));
        setShowEditModal(false);
        setEditLoading(false);
        alert('Профиль успешно обновлен!');
      }, 1000);
      
    } catch (error) {
      console.error('Update error:', error);
      setEditLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Новые пароли не совпадают');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
      return;
    }

    setPasswordLoading(true);
    
    try {
      // Здесь будет вызов API для смены пароля
      console.log('Смена пароля:', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      // Имитация успешной смены пароля
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordLoading(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Пароль успешно изменен!');
      }, 1000);
      
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Функция для получения имени пользователя (обрабатывает разные форматы)
  const getUserName = () => {
    if (!user) return '';
    return user.firstName || user.first_name || 'Не указано';
  };

  if (loading) {
    return (
      <Container fluid className="profile-container">
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Загрузка профиля...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="profile-container">
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container fluid className="profile-container">
        <Alert variant="warning">
          Пользователь не найден
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="profile-container">
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={6}>
            {/* Заголовок */}
            <div className="profile-header text-center mb-4">
              <h1 className="profile-title">👤 Профиль</h1>
              <p className="profile-subtitle">Управление вашей учетной записью</p>
            </div>

            {/* Основная информация - ОБЫЧНАЯ КАРТОЧКА */}
            <Card className="profile-card">
              <Card.Header className="profile-card-header">
                <h5 className="mb-0">📋 Основная информация</h5>
              </Card.Header>
              <Card.Body>
                <div className="profile-info-grid">
                  <div className="info-item">
                    <span className="info-label">Имя:</span>
                    <span className="info-value">{getUserName()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Телефон:</span>
                    <span className="info-value">{user.phone || 'Не указан'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Логин:</span>
                    <span className="info-value">{user.login || 'Не указан'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Дата регистрации:</span>
                    <span className="info-value">{formatDate(user.created_at)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">ID пользователя:</span>
                    <span className="info-value">#{user.id}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Кнопки действий - ОТДЕЛЬНЫЕ ХЕДЕР И КОНТЕНТ */}
            <div className="profile-actions-card mt-4">
              <Card className="profile-actions-header">
                <h5 className="mb-0">⚡ Действия</h5>
              </Card>
              <Card className="profile-actions-content">
                <div className="actions-grid">
                  <Button 
                    variant="primary" 
                    className="action-btn"
                    onClick={() => setShowEditModal(true)}
                  >
                    ✏️ Редактировать профиль
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="action-btn"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    🔒 Сменить пароль
                  </Button>
                </div>
              </Card>
            </div>

            {/* Статистика - ОТДЕЛЬНЫЕ ХЕДЕР И КОНТЕНТ */}
            <div className="profile-stats-card mt-4">
              <Card className="profile-stats-header">
                <h5 className="mb-0">📊 Статистика</h5>
              </Card>
              <Card className="profile-stats-content">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Созданных задач</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Выполнено задач</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {Math.ceil((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="stat-label">Дней с нами</div>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Модальное окно редактирования профиля */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        className="profile-modal"
      >
        <Modal.Header closeButton className="profile-modal-header">
          <Modal.Title>✏️ Редактировать профиль</Modal.Title>
        </Modal.Header>
        <Modal.Body className="profile-modal-body">
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editForm.firstName}
                onChange={handleEditInputChange}
                required
                className="profile-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Телефон</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleEditInputChange}
                required
                className="profile-input"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                name="login"
                value={editForm.login}
                onChange={handleEditInputChange}
                required
                className="profile-input"
              />
            </Form.Group>

            <div className="modal-actions">
              <Button 
                variant="secondary" 
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
                className="modal-btn"
              >
                Отмена
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={editLoading}
                className="modal-btn"
              >
                {editLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить изменения'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Модальное окно смены пароля */}
      <Modal 
        show={showPasswordModal} 
        onHide={() => setShowPasswordModal(false)}
        centered
        className="profile-modal"
      >
        <Modal.Header closeButton className="profile-modal-header">
          <Modal.Title>🔒 Сменить пароль</Modal.Title>
        </Modal.Header>
        <Modal.Body className="profile-modal-body">
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Текущий пароль</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                required
                className="profile-input"
                placeholder="Введите текущий пароль"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                required
                className="profile-input"
                placeholder="Введите новый пароль"
                minLength="6"
              />
              <Form.Text className="text-muted">
                Пароль должен быть не менее 6 символов
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Подтвердите новый пароль</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                required
                className="profile-input"
                placeholder="Повторите новый пароль"
              />
            </Form.Group>

            <div className="modal-actions">
              <Button 
                variant="secondary" 
                onClick={() => setShowPasswordModal(false)}
                disabled={passwordLoading}
                className="modal-btn"
              >
                Отмена
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={passwordLoading}
                className="modal-btn"
              >
                {passwordLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Смена пароля...
                  </>
                ) : (
                  'Сменить пароль'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Profile;