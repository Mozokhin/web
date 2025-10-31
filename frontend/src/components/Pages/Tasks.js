// frontend/src/components/Pages/Tasks.js
import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import './Tasks.css';

const Tasks = () => {
  return (
    <Container fluid className="tasks-container">
      <Row className="justify-content-center min-vh-100">
        <Col xs={12} lg={10} xl={8}>
          <div className="tasks-header text-center mb-5">
            <h1 className="tasks-title">📋 Доска задач</h1>
            <p className="tasks-subtitle">Скоро здесь появится управление задачами</p>
          </div>

          <Row>
            <Col md={6} className="mb-4">
              <Card className="tasks-card">
                <Card.Header className="tasks-card-header">
                  <h5 className="mb-0">📝 Новые задачи</h5>
                </Card.Header>
                <Card.Body className="text-center">
                  <Alert variant="info">
                    Раздел в разработке
                  </Alert>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="tasks-card">
                <Card.Header className="tasks-card-header">
                  <h5 className="mb-0">✅ Выполненные</h5>
                </Card.Header>
                <Card.Body className="text-center">
                  <Alert variant="success">
                    Скоро здесь появятся ваши задачи
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Tasks;