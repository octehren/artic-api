import mysql from 'mysql2/promise';
import { createArtwork } from '../../services/dbService';
import { DEFAULT_POOL_CONFIG } from '../../config';

let pool: mysql.Pool;

beforeAll(async () => {
  pool = mysql.createPool(DEFAULT_POOL_CONFIG);

  await pool.query(`
    INSERT INTO user (id, email, password)
    VALUES (1, 'test@example.com', 'password');
  `);
});

afterAll(() => {
  pool.end();
});

test('createArtwork creates an artwork and associates it with a user', async () => {
  await createArtwork(1, 101);

  const [rows] = await pool.query('SELECT * FROM artwork WHERE user_id = 1');
  const rowDataPackets = rows as mysql.RowDataPacket[];

  expect(rows).toHaveLength(1);
  expect(rowDataPackets[0]).toMatchObject({ user_id: 1, external_id: 101 });
});
