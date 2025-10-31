// frontend/src/services/currencyService.js
class CurrencyService {
  // Основной endpoint ЦБ РФ
  CBR_API_URL = 'https://www.cbr-xml-daily.ru/daily_json.js';

  // Получение текущих курсов валют
  async getExchangeRates() {
    try {
      const response = await fetch(this.CBR_API_URL);
      
      if (!response.ok) {
        throw new Error('Ошибка получения курсов валют');
      }
      
      const data = await response.json();
      return this.formatCurrencyData(data);
    } catch (error) {
      console.error('Currency API error:', error);
      throw new Error('Не удалось загрузить курсы валют');
    }
  }

  // Форматирование данных о валютах
  formatCurrencyData(data) {
    const currencies = {};
    const date = new Date(data.Date);
    
    // Основные валюты которые будем показывать
    const targetCurrencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'KZT'];
    
    targetCurrencies.forEach(code => {
      if (data.Valute[code]) {
        const currency = data.Valute[code];
        currencies[code] = {
          code: code,
          name: currency.Name,
          rate: currency.Value,
          previous: currency.Previous,
          change: currency.Value - currency.Previous,
          changePercent: ((currency.Value - currency.Previous) / currency.Previous * 100).toFixed(2),
          nominal: currency.Nominal
        };
      }
    });

    return {
      date: date,
      currencies: currencies,
      timestamp: data.Timestamp ? new Date(data.Timestamp) : new Date()
    };
  }

  // Получение флага валюты (эмодзи)
  getCurrencyFlag(currencyCode) {
    const flags = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺', 
      'GBP': '🇬🇧',
      'CNY': '🇨🇳',
      'JPY': '🇯🇵',
      'KZT': '🇰🇿',
      'RUB': '🇷🇺'
    };
    return flags[currencyCode] || '💵';
  }

  // Форматирование числа (разделители тысяч)
  formatNumber(number, decimals = 2) {
    return number.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Получение знака изменения курса
  getChangeSign(change) {
    return change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
  }

  // Получение цвета для изменения курса
  getChangeColor(change) {
    return change > 0 ? 'text-success' : change < 0 ? 'text-danger' : 'text-muted';
  }
}

export const currencyService = new CurrencyService();