const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');
const Song = require('../src/models/song');

describe('Songs', () => {
  let artistId;
  let albumId;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create({ body: { name: 'Tame Impala', genre: 'Rock' } }, (_, artist) => {
      console.log('artist', artist);
      artistId = artist._id.toString();
      console.log('artistId', artistId);
      Album.create(
        { body: { name: 'InnerSpeaker', year: 2010 }, params: { artistId } },
        (__, album) => {
          console.log('ALBUM', album);
          albumId = album._id.toString();
          done();
        },
      );
    });
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        Song.deleteMany({}, () => {
          done();
        });
      });
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /album/:albumId/song', () => {
    it('creates a new song under an album', done => {
      request(app)
        .post(`/album/${albumId}/song`)
        .send({
          artistId,
          name: 'Solitude Is Bliss',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(201);
          console.log('ROMY', res.body);
          const songId = res.body._id;
          expect(res.body).toEqual({
            name: 'Solitude Is Bliss',
            year: 2010,
            _id: songId,
            artist: {
              _id: artistId,
              name: 'Tame Impala',
              genre: 'Rock',
              __v: 0,
            },
            album: {
              _id: albumId,
              artist: artistId,
              name: 'InnerSpeaker',
              year: 2010,
              __v: 0,
            },
            __v: 0,
          });
          done();
        });
    });
  });
});
