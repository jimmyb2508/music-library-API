const Artist = require('../models/artist');

exports.create = (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });

  artist
    .save()
    .then(() => {
      res.status(201).json(artist);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.list = (req, res) => {
  Artist.find().then(artists => {
    res.status(200).json(artists);
  });
};

exports.find = (req, res) => {
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  });
};

exports.patch = (req, res) => {
  Artist.findOne({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      if (req.body.name) {
        artist.set({ name: req.body.name });
      }
      if (req.body.genre) {
        artist.set({ genre: req.body.genre });
      }
      artist.save().then(() => {
        res.status(200).json(artist);
      });
    }
  });
};

exports.delete = (req, res) => {
  Artist.findByIdAndRemove({ _id: req.params.id }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(204).json(artist);
    }
  });
};
