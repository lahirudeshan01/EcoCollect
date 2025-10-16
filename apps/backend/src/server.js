require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const Authority = require('./features/auth/authorityModel');

const PORT = process.env.PORT || 5000;

const seedAuthority = async () => {
  try {
    const count = await Authority.countDocuments();
    console.log('Checking authority count:', count);
    if (count === 0) {
      const newAuthority = await Authority.create({
        username: 'admin',
        password: 'password',
      });
      console.log('Default authority created:', newAuthority.username);
    } else {
      console.log('Authority already exists, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding default authority:', error);
  }
};

(async () => {
  try {
    await connectDB();
    await seedAuthority();
    http.createServer(app).listen(PORT, () => {
      console.log(`Backend API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
