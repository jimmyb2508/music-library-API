const Album = require('../models/album');

exports.create = (req, res) => {
  const { id } = req.params;
  const album = new Album({
    name: req.body.name,
    year: req.body.year,
    artist: id,
  });

  if (!album.artist) {
    res.status(404).json({ error: 'The artist could not be found.' });
  } else {
    album.save().then(() => {
      res.status(201).json(album);
    });
  }
};

exports.list = (req, res) => {
  Album.find().then(album => {
    res.status(200).json(album);
  });
};
