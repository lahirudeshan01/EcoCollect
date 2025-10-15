// Entry point for backend (Express)
require('dotenv').config(); // Load .env
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.json());

// MongoDB connection using environment variable
const uri = process.env.MONGO_URI; // Ensure your .env has URL-encoded password
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    const db = client.db('SmartWasteDB');
    app.locals.db = db; // Make db accessible in routes
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectDB();

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
