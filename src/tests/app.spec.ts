import app from '../app';
import supertest from 'supertest';
import { promises as fs } from 'fs';
import { ImageProcessing } from '../utilities/imageProcessing';
import path from 'path';

const request = supertest(app);

describe('Test endpoint response', () => {
  const imageName = 'test.png';
  afterAll(async () => {
    await fs.unlink(ImageProcessing.imageFullPath(imageName)).catch(() => true);
  });

  it('/api should respond with 200', (done) => {
    request.get('/api').expect(200, done);
  });

  it('/api/images/upload should upload test.png to full folder', (done) => {
    request
      .post('/api/images/upload')
      .attach('files', path.resolve('src', 'tests', 'fixtures', imageName))
      .expect(200, done);
  });

  it('/api/images/full list of images', (done) => {
    request
      .get('/api/images/full')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(Array.isArray(res.body)).toBeTruthy();
        done();
      });
  });

  it('/api/images/full at least return one image in the list image.png', (done) => {
    request
      .get('/api/images/full')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const [...list] = res.body;
        expect(list.length).toBeGreaterThanOrEqual(1);
        done();
      });
  });

  it('/api/images/thumbnails list of images', (done) => {
    request
      .get('/api/images/thumbnails')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        expect(Array.isArray(res.body)).toBeTruthy();
        done();
      });
  });

  it('/api/images should return 400 if there is missing params', (done) => {
    request
      .get('/api/images')
      .expect(
        400,
        'Please Provide value for all Params filename, width and height',
        done
      );
  });

  it('/api/images should return 400 if you provide non-numeric values for width or height', (done) => {
    request
      .get('/api/images?filename=image.png&width=dd&height=dd')
      .expect(
        400,
        'Please make sure that width and height numeric values',
        done
      );
  });

  it('/api/images should return 400 if there negative values in width or height', (done) => {
    request
      .get('/api/images?filename=image.png&width=-50&height=100')
      .expect(
        400,
        'Please make sure that width and height Positive values',
        done
      );
  });

  it('/api/images should return 400 if you provide filename not exists', (done) => {
    request
      .get('/api/images?filename=image500.png&width=100&height=100')
      .expect(400, 'Image not exists', done);
  });
});
