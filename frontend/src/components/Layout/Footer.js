// frontend/src/components/Layout/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <Container>
        <div className="footer-content text-center">
          <p className="footer-text">
            Сделано в Институте Высшая IT школа г. Кострома
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;