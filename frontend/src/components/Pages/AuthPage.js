// frontend/src/components/Pages/AuthPage.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { apiService } from '../../services/api';
import './AuthPage.css';

const AuthPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    phone: '',
    firstName: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type = 'danger') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
    setErrors({});
    setFormData({ login: '', password: '', confirmPassword: '', phone: '', firstName: '' });
  };

  const handleShowRegister = () => {
    setShowRegisterModal(true);
    setErrors({});
    setFormData({ login: '', password: '', confirmPassword: '', phone: '', firstName: '' });
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setErrors({});
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await apiService.login({
        login: formData.login,
        password: formData.password
      });

      if (result.success) {
        apiService.setToken(result.data.token);
        showAlert('Вход выполнен успешно!', 'success');
        handleCloseModals();
        
        // Редирект на страницу профиля
        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await apiService.register({
        firstName: formData.firstName,
        phone: formData.phone,
        login: formData.login,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (result.success) {
        apiService.setToken(result.data.token);
        showAlert('Регистрация прошла успешно!', 'success');
        handleCloseModals();
        
        // Редирект на страницу профиля
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="auth-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            {/* Alert */}
            {alert.show && (
              <Alert variant={alert.type} className="mb-3">
                {alert.message}
              </Alert>
            )}

            <Card className="auth-card shadow-lg">
              <Card.Body className="text-center p-5">
                <div className="mb-4">
                  <h1 className="brand-title">Welcome</h1>
                  <p className="brand-subtitle">Добро пожаловать в наш сервис</p>
                </div>

                <div className="d-grid gap-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="auth-btn login-btn"
                    onClick={handleShowLogin}
                    disabled={loading}
                  >
                    Вход
                  </Button>
                  
                  <Button 
                    variant="outline-primary" 
                    size="lg" 
                    className="auth-btn register-btn"
                    onClick={handleShowRegister}
                    disabled={loading}
                  >
                    Регистрация
                  </Button>
                </div>

                <div className="mt-4">
                  <p className="text-muted small">
                    Присоединяйтесь к нашему сообществу
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Модальное окно входа */}
      <Modal 
        show={showLoginModal} 
        onHide={handleCloseModals}
        centered
        className="auth-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Вход в аккаунт</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                placeholder="Введите ваш логин"
                className="modal-input"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Введите ваш пароль"
                className="modal-input"
                required
                disabled={loading}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 modal-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Модальное окно регистрации */}
      <Modal 
        show={showRegisterModal} 
        onHide={handleCloseModals}
        centered
        className="auth-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Регистрация</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Введите ваше имя"
                className="modal-input"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Номер телефона</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+7 (XXX) XXX-XX-XX"
                className="modal-input"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                placeholder="Придумайте логин"
                className="modal-input"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Придумайте пароль (мин. 6 символов)"
                className="modal-input"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Повторите пароль</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Повторите пароль"
                className="modal-input"
                required
                disabled={loading}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 modal-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Регистрация...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthPage;