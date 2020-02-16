const Song = require('../models/song');

exports.create = (req, res) => {
  console.log('SONGS', req.body, req.params);
  const song = new Song({
    name: req.body.name,
    year: req.body.year,
    artist: req.body.artistId,
    album: req.params.albumId,
  });
  if (!song.album) {
    res.status(404).json({ error: 'The album does not exist.' });
  } else {
    song.save().then(savedSong => {
      Song.findOne({ _id: savedSong._id })
        .populate({ path: 'Artist' })
        .populate({ path: 'Album' })
        .exec((err, songId) => {
          res.status(201).json(songId);
        });
    });
  }
};
