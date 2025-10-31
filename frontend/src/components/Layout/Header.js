// frontend/src/components/Layout/Header.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    apiService.removeToken();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="main-header">
      <Container>
        <Navbar.Brand className="brand">
          🚀 MyApp
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              className={`nav-link-custom ${isActive('/home') ? 'active' : ''}`}
              onClick={() => navigate('/home')}
            >
              🏠 Главная
            </Nav.Link>
            <Nav.Link 
              className={`nav-link-custom ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => navigate('/profile')}
            >
              👤 Профиль
            </Nav.Link>
            <Nav.Link 
              className={`nav-link-custom ${isActive('/tasks') ? 'active' : ''}`}
              onClick={() => navigate('/tasks')}
            >
              📋 Доска задач
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Button 
              variant="outline-light" 
              size="sm" 
              onClick={handleLogout}
              className="logout-btn"
            >
              🚪 Выйти
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;