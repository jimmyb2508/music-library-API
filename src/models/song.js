const mongoose = require('mongoose');

const { Schema } = mongoose;

const songSchema = new mongoose.Schema({
  name: String,
  album: { type: Schema.ObjectId, ref: 'Album' },
  artist: { type: Schema.ObjectId, ref: 'Artist' },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
