import request from 'supertest';
import app from '../server';

const req = request(app);

describe('Test Suite for building an express server project', () => {
    // '/getImageList'
    it('Initialize the server. Clear images and thumbnails', async () => {
        await req
            .get('/image/clean')
            .expect(200)
            .expect ( (response) => {
                console.log(response.body);
            });
    });
});