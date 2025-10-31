// backend/server.js
const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🔄 Starting server...');
    
    // Проверяем подключение к БД
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();