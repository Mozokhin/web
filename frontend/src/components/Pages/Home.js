// frontend/src/components/Pages/Home.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { apiService } from '../../services/api';
import { currencyService } from '../../services/currencyService';
import { weatherService } from '../../services/weatherService';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currencyRates, setCurrencyRates] = useState(null);
  const [currencyLoading, setCurrencyLoading] = useState(true);
  const [currencyError, setCurrencyError] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
    loadCurrencyRates();
    loadWeather();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadProfile = async () => {
    try {
      const result = await apiService.getProfile();
      if (result.success) {
        setUser(result.data.user);
      }
    } catch (error) {
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrencyRates = async () => {
    try {
      setCurrencyLoading(true);
      setCurrencyError('');
      
      const rates = await currencyService.getExchangeRates();
      setCurrencyRates(rates);
    } catch (error) {
      console.error('Currency loading error:', error);
      setCurrencyError(error.message);
    } finally {
      setCurrencyLoading(false);
    }
  };

  const loadWeather = async () => {
    try {
      setWeatherLoading(true);
      setWeatherError('');
      
      const weatherData = await weatherService.getWeatherAuto();
      setWeather(weatherData);
    } catch (error) {
      console.error('Weather loading error:', error);
      setWeatherError(error.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const refreshCurrency = () => {
    loadCurrencyRates();
  };

  const refreshWeather = () => {
    loadWeather();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container fluid className="home-container">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="sm" />
        </div>
      </Container>
    );
  }

  // Основные валюты для отображения (только USD и EUR)
  const mainCurrencies = currencyRates ? 
    Object.values(currencyRates.currencies).filter(currency => 
      ['USD', 'EUR'].includes(currency.code)
    ) : [];

  return (
    <Container fluid className="home-container">
      {/* Основная информация - на всю ширину */}
      <div className="main-info-section">
        <Container fluid>
          <Row className="align-items-center g-0">
            {/* Дата и время */}
            <Col className="info-column time-column">
              <div className="time-section">
                {weatherLoading ? (
                  <div className="loading">
                    <Spinner animation="border" size="sm" />
                  </div>
                ) : weatherError ? (
                  <div className="error">
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={refreshWeather}
                      className="refresh-btn"
                    >
                      🔄
                    </Button>
                  </div>
                ) : weather ? (
                  <>
                    <div className="time-display">
                      {formatTime(currentTime)}
                    </div>
                    <div className="date-display">
                      {formatDate(currentTime)}
                    </div>
                  </>
                ) : null}
              </div>
            </Col>

            {/* Разделитель */}
            <div className="column-divider"></div>

            {/* Погода */}
            <Col className="info-column weather-column">
              <div className="weather-section">
                {weatherLoading ? (
                  <div className="loading">
                    <Spinner animation="border" size="sm" variant="light" />
                  </div>
                ) : weatherError ? (
                  <div className="error">
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={refreshWeather}
                      className="refresh-btn"
                    >
                      🔄
                    </Button>
                  </div>
                ) : weather ? (
                  <>
                    <div className="weather-main">
                      <div className="weather-icon">{weather.icon}</div>
                      <div className="weather-temp">{weather.temperature}°</div>
                    </div>
                    <div className="weather-desc">{weather.description}</div>
                  </>
                ) : null}
              </div>
            </Col>

            {/* Разделитель */}
            <div className="column-divider"></div>

            {/* Курсы валют */}
            <Col className="info-column currency-column">
              <div className="currency-section">
                {currencyLoading ? (
                  <div className="loading">
                    <Spinner animation="border" size="sm" variant="light" />
                  </div>
                ) : currencyError ? (
                  <div className="error">
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={refreshCurrency}
                      className="refresh-btn"
                    >
                      🔄
                    </Button>
                  </div>
                ) : mainCurrencies.length > 0 ? (
                  <div className="currency-list">
                    {mainCurrencies.map(currency => (
                      <div key={currency.code} className="currency-item">
                        <div className="currency-symbol">
                          {currencyService.getCurrencyFlag(currency.code)}
                          <span className="currency-code">{currency.code}</span>
                        </div>
                        <div className="currency-rate">
                          {currencyService.formatNumber(currency.rate, 2)}
                        </div>
                        <div className={`currency-change ${currencyService.getChangeColor(currency.change)}`}>
                          {currencyService.getChangeSign(currency.change)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Подчеркивающая линия */}
      <div className="underline"></div>
    </Container>
  );
};

export default Home;