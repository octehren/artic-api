import mysql from 'mysql2/promise';
import { pool, createArtwork, getUserEmailByArtworkId, createUser } from '../../services/dbService';


let testUserId: number;
const existingArtwork = 101;
const unexistingArtwork = 9999;
const testUserEmail = 'test@example.com';
const testUserPassword = 'password'

beforeAll(async () => {
  // start transaction to be rolled back once tests end
  await pool.query('START TRANSACTION');
  // creates test user
  testUserId = await createUser(testUserEmail, testUserPassword);
});

afterAll(async () => {
  // Roll back the transaction to undo any changes made during the tests
  await pool.execute('ROLLBACK');
  pool.end();
});

test('createArtwork creates an artwork and associates it with a user', async () => {
  await createArtwork(testUserId, existingArtwork);

  const [rows] = await pool.query('SELECT * FROM artwork WHERE user_id = ?', [testUserId]);
  const rowDataPackets = rows as mysql.RowDataPacket[];

  expect(rows).toHaveLength(1);
  expect(rowDataPackets[0]).toMatchObject({ user_id: testUserId, external_id: existingArtwork });
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
