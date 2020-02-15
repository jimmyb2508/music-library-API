const mongoose = require('mongoose');

const { Schema } = mongoose;

const songSchema = new mongoose.Schema({
  name: String,
  year: Number,
  artist: { type: Schema.ObjectId, ref: 'Artist' },
  album: { type: Schema.ObjectId, ref: 'Album' },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
