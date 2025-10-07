// Entry point for backend (Express)
const express = require('express');
const app = express();

app.use(express.json());

// Routes
const routes = require('./routes');
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
