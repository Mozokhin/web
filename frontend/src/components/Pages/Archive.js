// frontend/src/components/Pages/Archive.js
import React from 'react';
import { Container, Alert } from 'react-bootstrap';

const Archive = () => {
  return (
    <Container className="mt-5">
      <Alert variant="info">
        <Alert.Heading>🗄️ Архив задач</Alert.Heading>
        <p>
          Этот раздел находится в разработке. Скоро здесь можно будет просматривать
          архивированные задачи.
        </p>
      </Alert>
    </Container>
  );
};

export default Archive;