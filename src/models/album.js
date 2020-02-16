const mongoose = require('mongoose');

const { Schema } = mongoose;

const albumSchema = new mongoose.Schema({
  name: String,
  year: Number,
  artist: { type: Schema.ObjectId, ref: 'Artist' },
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
