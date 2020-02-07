const express = require('express');

const app = express();

const artistControllers = require('./controllers/artists');

app.post('/artists', artistControllers.create);

app.get('*', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

module.exports = app;
