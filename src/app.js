const express = require('express');

const artistControllers = require('./controllers/artists');

const app = express();

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.find);

app.patch('/artists/:id', artistControllers.patch);

app.delete('/artists/:id', artistControllers.delete);

// app.get('*', (req, res) => {
//   res.status(200).json({ message: 'Hello World!' });
// });

module.exports = app;
