import request from 'supertest';
import server from '../index'; // replace with your actual server file
import { pool } from '../services/dbService';

beforeAll(async () => {
    // starts transaction to be rolled back once tests end
    await pool.query('START TRANSACTION');
});

afterAll(async () => {
    // Roll back the transaction to undo any changes made during the tests
    await pool.execute('ROLLBACK');
    pool.end();
    server.close();
});

const getRandomSample = (array: number[]) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

const existingArtworks = [26650, 122159, 22736, 21934, 14572];

const artworkExternalId = getRandomSample(existingArtworks);

describe('Main app routes', () => {
    let testUser = {
        email: "test@test.com",
        password: "password"
    };
    let token = '';

    // Test for the /signup route
    it('/signup should create a new user', async () => {
        const res = await request(server)
            .post('/signup')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        token = res.body.token; // save the token for the next tests
    });

    // Test for the /login route
    it('/login should validate an user and return an auth token', async () => {
        const res = await request(server)
            .post('/login')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');

        token = res.body.token; // save the token for the next tests
    });

    // Test for the /acquire route
    it('/acquire should allow a logged in user to acquire an artwork', async () => {
        const res = await request(server)
            .get(`/acquire?id=${artworkExternalId}`) 
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('artist_display'); // has an artist
        expect(res.body).toHaveProperty('ownedBy', testUser.email); // owned by test user
    });
});
