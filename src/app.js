const express = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
