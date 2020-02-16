const express = require('express');

const artistControllers = require('./controllers/artists');

const albumControllers = require('./controllers/albums');

const songControllers = require('./controllers/songs');

const app = express();

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:artistId', artistControllers.find);

app.patch('/artists/:artistId', artistControllers.patch);

app.delete('/artists/:artistId', artistControllers.delete);

app.post('/artists/:artistId/albums', albumControllers.create);

app.get('/albums', albumControllers.list);

app.get('/artists/:artistId/albums', albumControllers.find);

app.patch('/artists/:artistId/albums/:albumId', albumControllers.patch);

app.delete('/artists/:artistId/albums/:albumId', albumControllers.delete);

app.post('/albums/:albumId/songs', songControllers.create);

app.get('/songs', songControllers.list);

app.get('/songs/:songId', songControllers.find);

app.patch('/songs/:songId', songControllers.patch);

app.delete('/songs/:songId', songControllers.delete);

module.exports = app;
