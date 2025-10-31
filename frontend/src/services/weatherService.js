// frontend/src/services/weatherService.js
class WeatherService {
  // Получение геолокации пользователя
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается вашим браузером'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Не удалось определить ваше местоположение';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Доступ к геолокации запрещен. Разрешите доступ в настройках браузера';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Информация о местоположении недоступна';
              break;
            case error.TIMEOUT:
              errorMessage = 'Время ожидания геолокации истекло';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Получение погоды по координатам через Open-Meteo
  async getWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&daily=sunrise,sunset&timezone=auto&forecast_days=1`
      );
      
      if (!response.ok) {
        throw new Error('Ошибка получения данных о погоде');
      }
      
      const data = await response.json();
      return this.formatWeatherData(data, lat, lon);
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error('Не удалось загрузить данные о погоде');
    }
  }

  // Получение погоды по названию города (через геокодинг + погоду)
  async getWeatherByCity(city = 'Moscow') {
    try {
      // Сначала получаем координаты города
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru&format=json`
      );
      
      if (!geocodingResponse.ok) {
        throw new Error('Ошибка определения города');
      }
      
      const geocodingData = await geocodingResponse.json();
      
      if (!geocodingData.results || geocodingData.results.length === 0) {
        throw new Error('Город не найден');
      }
      
      const location = geocodingData.results[0];
      return await this.getWeatherByCoords(location.latitude, location.longitude);
    } catch (error) {
      console.error('City weather error:', error);
      throw new Error('Не удалось загрузить данные о погоде для выбранного города');
    }
  }

  // Автоматическое получение погоды
  async getWeatherAuto() {
    try {
      const location = await this.getUserLocation();
      return await this.getWeatherByCoords(location.lat, location.lon);
    } catch (geoError) {
      console.log('Geolocation failed, using default city:', geoError.message);
      return await this.getWeatherByCity('Moscow');
    }
  }

  // Форматирование данных о погоде
  formatWeatherData(data, lat, lon) {
    const current = data.current;
    const daily = data.daily;
    
    return {
      city: this.getCityName(lat, lon) || 'Ваше местоположение',
      country: '',
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      description: this.getWeatherDescription(current.weather_code),
      icon: this.getWeatherIcon(current.weather_code),
      humidity: current.relative_humidity_2m,
      pressure: Math.round(current.pressure_msl * 0.750062), // переводим в мм рт.ст.
      windSpeed: current.wind_speed_10m,
      windDirection: this.getWindDirection(current.wind_direction_10m),
      sunrise: new Date(daily.sunrise[0]),
      sunset: new Date(daily.sunset[0]),
      updatedAt: new Date()
    };
  }

  // Получение названия города по координатам (упрощенное)
  getCityName(lat, lon) {
    // В реальном приложении здесь можно использовать обратное геокодирование
    // Но для простоты возвращаем общее название
    return 'Ваше местоположение';
  }

  // Описания погоды по кодам WMO
  getWeatherDescription(weatherCode) {
    const weatherDescriptions = {
      0: 'Ясно',
      1: 'Преимущественно ясно',
      2: 'Переменная облачность',
      3: 'Пасмурно',
      45: 'Туман',
      48: 'Туман с инеем',
      51: 'Лекая морось',
      53: 'Умеренная морось',
      55: 'Сильная морось',
      56: 'Лекая ледяная морось',
      57: 'Сильная ледяная морось',
      61: 'Небольшой дождь',
      63: 'Умеренный дождь',
      65: 'Сильный дождь',
      66: 'Ледяной дождь',
      67: 'Сильный ледяной дождь',
      71: 'Небольшой снег',
      73: 'Умеренный снег',
      75: 'Сильный снег',
      77: 'Снежные зерна',
      80: 'Небольшие ливни',
      81: 'Умеренные ливни',
      82: 'Сильные ливни',
      85: 'Небольшие снежные ливни',
      86: 'Сильные снежные ливни',
      95: 'Гроза',
      96: 'Гроза с небольшим градом',
      99: 'Гроза с сильным градом'
    };
    
    return weatherDescriptions[weatherCode] || 'Неизвестно';
  }

  // Иконки погоды по кодам WMO
  getWeatherIcon(weatherCode) {
    const weatherIcons = {
      0: '☀️',   // Ясно
      1: '🌤️',   // Преимущественно ясно
      2: '⛅',   // Переменная облачность
      3: '☁️',   // Пасмурно
      45: '🌫️',  // Туман
      48: '🌫️',  // Туман с инеем
      51: '🌧️',  // Морось
      53: '🌧️',  // Морось
      55: '🌧️',  // Морось
      56: '🌧️',  // Ледяная морось
      57: '🌧️',  // Ледяная морось
      61: '🌦️',  // Дождь
      63: '🌧️',  // Дождь
      65: '🌧️',  // Дождь
      66: '🌧️',  // Ледяной дождь
      67: '🌧️',  // Ледяной дождь
      71: '🌨️',  // Снег
      73: '🌨️',  // Снег
      75: '🌨️',  // Снег
      77: '🌨️',  // Снег
      80: '🌦️',  // Ливни
      81: '🌧️',  // Ливни
      82: '🌧️',  // Ливни
      85: '🌨️',  // Снежные ливни
      86: '🌨️',  // Снежные ливни
      95: '⛈️',   // Гроза
      96: '⛈️',   // Гроза с градом
      99: '⛈️'    // Гроза с градом
    };
    
    return weatherIcons[weatherCode] || '❓';
  }

  // Определение направления ветра
  getWindDirection(degrees) {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    return directions[Math.round(degrees / 45) % 8];
  }

  // Получение фона карточки в зависимости от погоды
  getWeatherBackground(icon) {
    const weatherBackgrounds = {
      '☀️': 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
      '🌤️': 'linear-gradient(135deg, #a8caba 0%, #5d4157 100%)',
      '⛅': 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
      '☁️': 'linear-gradient(135deg, #636363 0%, #a2ab58 100%)',
      '🌫️': 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      '🌧️': 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
      '🌦️': 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
      '🌨️': 'linear-gradient(135deg, #e6dada 0%, #274046 100%)',
      '⛈️': 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)'
    };
    
    return weatherBackgrounds[icon] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }
}

export const weatherService = new WeatherService();