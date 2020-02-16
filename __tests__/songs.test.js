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

  beforeAll(done => {
    Artist.create({ name: 'Tame Impala', genre: 'Rock' }, (_, artist) => {
      artistId = artist._id.toString();
      Album.create({ name: 'InnerSpeaker', year: 2010, artist: artistId }, (__, album) => {
        albumId = album._id.toString();
        done();
      });
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

  describe('POST /albums/:albumId/songs', () => {
    it('creates a new song under an album', done => {
      request(app)
        .post(`/albums/${albumId}/songs`)
        .send({
          name: 'Solitude Is Bliss',
          artist: artistId,
          album: albumId,
        })
        .then(res => {
          expect(res.status).toBe(201);
          const songId = res.body._id;
          expect(res.body).toEqual({
            name: 'Solitude Is Bliss',
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

    it('returns a 404 and does not create an song if the album does not exist', done => {
      request(app)
        .post(`/albums/8654/songs`)
        .send({
          name: 'Solitude is Bliss',
          artist: artistId,
          album: albumId,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The album does not exist.');

          Song.find({}, (err, songs) => {
            expect(err).toBe(null);
            expect(songs.length).toBe(0);
            done();
          });
        });
    });
  });

  describe('with songs in the database', () => {
    let songs;
    beforeEach(done => {
      Promise.all([
        Song.create({ name: 'Solitude is Bliss', album: artistId, artist: albumId }),
      ]).then(documents => {
        songs = documents;
        done();
      });
    });

    describe('GET /songs', () => {
      it('gets all songs', done => {
        request(app)
          .get('/songs')
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body.album).toBe(songs.album);
            expect(res.body.artist).toBe(songs.artist);
          });
        done();
      });
    });

    describe('GET /songs/5949', () => {
      it('gets all songs by album id', done => {
        request(app)
          .get(`/songs/${songs[0]._id}`)
          .then(res => {
            expect(res.status).toBe(200);
            const result = [res.body];

            result.forEach(song => {
              expect(res.body.name).toBe(song.name);
              expect(res.body.year).toBe(song.year);
            });
            done();
          });
      });
    });

    describe('PATCH /songs/5934', () => {
      it('updates song data by :songId', done => {
        const newSong = 'Smells Like Teen Spirit';
        request(app)
          .patch(`/songs/${songs[0]._id}`)
          .send({ name: newSong })
          .then(res => {
            expect(res.status).toBe(200);
            Song.findById(songs[0]._id, (_, updatedSong) => {
              expect(updatedSong.name).toBe('Smells Like Teen Spirit');
              done();
            });
          });
      });
    });

    describe('DELETE /songs/5920', () => {
      it('deletes song record by id', done => {
        const song = songs[0];
        request(app)
          .delete(`/songs/${songs[0]._id}`)
          .then(res => {
            expect(res.status).toBe(204);
            Song.findById(song._id, (error, deletedSong) => {
              expect(error).toBe(null);
              expect(deletedSong).toBe(null);
              done();
            });
          });
      });
    });
  });
});
