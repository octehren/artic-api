import mysql from 'mysql2/promise';
import { createArtwork, getUserEmailByArtworkId } from '../../services/dbService';
import { DEFAULT_POOL_CONFIG } from '../../config';

let pool: mysql.Pool;
let testUserId: number;
const existingArtwork = 101;
const unexistingArtwork = 9999;
const testUserEmail = 'test@example.com';

beforeAll(async () => {
  pool = mysql.createPool(DEFAULT_POOL_CONFIG);
  // start transaction to be rolled back once tests end
  await pool.query('START TRANSACTION');
  // creates test user
  await pool.query(`
    INSERT INTO user (email, password)
    VALUES ('${testUserEmail}', 'password');
  `)

  const testUserQuery = await pool.query(`
    SELECT id FROM user
    WHERE email = '${testUserEmail}'
    LIMIT 1
  `) as mysql.RowDataPacket[];
  testUserId = testUserQuery[0].id;
});

afterAll(async () => {
  // Roll back the transaction to undo any changes made during the tests
  await pool.query('ROLLBACK');
  pool.end();
});

test('createArtwork creates an artwork and associates it with a user', async () => {
  await createArtwork(testUserId, existingArtwork);

  const [rows] = await pool.query('SELECT * FROM artwork WHERE user_id = 1');
  const rowDataPackets = rows as mysql.RowDataPacket[];

  expect(rows).toHaveLength(1);
  expect(rowDataPackets[0]).toMatchObject({ user_id: 1, external_id: 101 });
});


describe('getUserEmailByArtworkId', () => {
    it('returns the correct user email for an artwork', async () => {
        await createArtwork(testUserId, existingArtwork);
        const email = await getUserEmailByArtworkId(existingArtwork);
        expect(email).toBe(testUserEmail);
    });

    it('returns null for an artwork with no user', async () => {
        // Assuming we have no artwork with external_id of 9999
        const email = await getUserEmailByArtworkId(unexistingArtwork);
        expect(email).toBe(null);
    });
});
