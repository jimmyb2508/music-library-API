const Album = require('../models/album');
const Artist = require('../models/artist');
const Song = require('../models/song');

exports.create = (req, res) => {
  console.log('SONGS', req.body, req.params);
  const song = new Song({
    name: req.body.name,
    year: req.body.year,
    album: req.params.albumId,
    artist: req.body.artistId,
  });
  if (!song.album) {
    res.status(404).json({ error: 'The album does not exist.' });
  } else {
    song.save().then(savedSong => {
      Song.findOne({ _id: savedSong._id })
        .populate({ path: 'album' })
        .populate({ path: 'artist' })
        .exec((err, songId) => {
          res.status(201).json(songId);
        });
    });
  }
};
