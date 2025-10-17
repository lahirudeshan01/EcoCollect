require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

(async () => {
  try {
    await connectDB();

    // Pick port from env or fallback to 5000
    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`✅ Backend API listening on http://localhost:${PORT}`);
    });

    // Handle "port already in use" error gracefully
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try using another port.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();