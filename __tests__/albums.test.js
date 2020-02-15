const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');

describe('/albums', () => {
  let artist;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create(
      {
        name: 'Tame Impala',
        genre: 'Rock',
      },
      (_, document) => {
        artist = document;
        done();
      },
    );
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        done();
      });
    });
  });

  afterAll(done => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
    done();
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', done => {
      request(app)
        .post(`/artists/${artist._id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(201);

          Album.findById(res.body._id, (err, album) => {
            expect(err).toBe(null);
            expect(album.name).toBe('InnerSpeaker');
            expect(album.year).toBe(2010);
            expect(album.artist).toEqual(artist._id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', done => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The artist could not be found.');

          Album.find({}, (err, albums) => {
            expect(err).toBe(null);
            expect(albums.length).toBe(0);
            done();
          });
        });
    });
  });

  describe('with albums in the database', () => {
    let albums;
    beforeEach(done => {
      Promise.all([Album.create({ name: 'Innerspeaker', year: 2010 })]).then(documents => {
        albums = documents;
        done();
      });
    });

    describe('GET /albums', () => {
      it('gets all albums', done => {
        request(app)
          .get(`/albums`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body.name).toBe(albums.name);
            expect(res.body.year).toBe(albums.year);
          });
        done();
      });
    });

    describe('GET /albums/:artistId/albums', () => {
      it('gets all albums by artist id', done => {
        request(app)
          .get(`/artists/${artist._id}`)
          .then(res => {
            expect(res.status).toBe(200);
            const result = [res.body];

            result.forEach(album => {
              expect(res.body.name).toBe(album.name);
              expect(res.body.year).toBe(album.year);
            });
            done();
          });
      });
    });

    describe('PATCH /artists/:artistId/albums/:albumId', () => {
      it('updates album data by :artistId', done => {
        const album = albums[0];
        const newAlbum = 'Nevermind';
        request(app)
          .patch(`/artists/${artist._id}/albums/${album._id}`)
          .send({ name: newAlbum })
          .then(res => {
            expect(res.status).toBe(200);
            Album.findById(album._id, (_, updatedAlbum) => {
              expect(updatedAlbum.name).toBe('Nevermind');
              done();
            });
          });
      });
    });

    describe('DELETE /artists/:artistId/albums/:albumId', () => {
      it('deletes album record by id', done => {
        const album = albums[0];
        request(app)
          .delete(`/artists/${artist._id}/albums/${album._id}`)
          .then(res => {
            expect(res.status).toBe(204);
            Album.findById(album._id, (error, deletedAlbum) => {
              expect(error).toBe(null);
              expect(deletedAlbum).toBe(null);
              done();
            });
          });
      });
    });
  });
});
