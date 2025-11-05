// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AuthPage from './components/Pages/AuthPage';
import Home from './components/Pages/Home';
import Profile from './components/Pages/Profile';
import Tasks from './components/Pages/Tasks';
import Archive from './components/Pages/Archive';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Компонент-обертка для страниц с хедером и футером
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Страница авторизации без хедера и футера */}
          <Route path="/" element={<AuthPage />} />
          
          {/* Все остальные страницы с хедером и футером */}
          <Route path="/home" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <Profile />
            </Layout>
          } />
          <Route path="/tasks" element={
            <Layout>
              <Tasks />
            </Layout>
          } />
          <Route path="/archive" element={
            <Layout>
                <Archive />
              </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;