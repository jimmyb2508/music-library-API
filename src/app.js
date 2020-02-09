const express = require('express');

const artistControllers = require('./controllers/artists');

const albumControllers = require('./controllers/albums');

const app = express();

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.find);

app.patch('/artists/:id', artistControllers.patch);

app.delete('/artists/:id', artistControllers.delete);

app.post('/artists/:id/albums', albumControllers.create);

app.get('/artists/:id/albums', albumControllers.list);

module.exports = app;
