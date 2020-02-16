const Song = require('../models/song');

exports.create = (req, res) => {
  const song = new Song({
    name: req.body.name,
    album: req.params.albumId,
    artist: req.body.artist,
  });
  if (!song.album) {
    res.status(404).json({ error: 'The album does not exist.' });
  } else {
    song.save().then(savedSong => {
      Song.findOne({ _id: savedSong._id })
        .populate({ path: 'artist' })
        .populate({ path: 'album' })
        .exec((err, songId) => {
          res.status(201).json(songId);
        });
    });
  }
};

exports.list = (req, res) => {
  Song.find().then(songs => {
    res.status(200).json(songs);
  });
};

exports.find = (req, res) => {
  Song.findOne({ _id: req.params.songId }, (err, song) => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      res.status(200).json(song);
    }
  });
};

exports.patch = (req, res) => {
  Song.findById({ _id: req.params.songId }, (err, song) => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      song.set(req.body);
      song.save().then(updatedSong => {
        res.status(200).json(updatedSong);
      });
    }
  });
};

exports.delete = (req, res) => {
  Song.findByIdAndDelete({ _id: req.params.songId }, (err, song) => {
    if (!song) {
      res.status(404).json({ error: 'The song could not be found.' });
    } else {
      res.status(204).json({ Message: 'Song was deleted' });
    }
  });
};
