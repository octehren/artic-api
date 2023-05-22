import mysql from 'mysql2/promise';
import { DEFAULT_POOL_CONFIG } from '../config';


const pool = mysql.createPool(DEFAULT_POOL_CONFIG);

export const createArtwork = async (userId: number, externalId: number): Promise<void> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM user WHERE id = ? LIMIT 1', [userId]);

    // .length only available as mysql.RowDataPacket[] interface
    const rowDataPackets = rows as mysql.RowDataPacket[];

    if (rowDataPackets.length === 0) {
      throw new Error('User not found');
    }

    await pool.execute('INSERT INTO artwork (user_id, external_id) VALUES (?, ?)', [userId, externalId]);
  } catch (err) {
    console.log(err.message);
  }
};

export async function getUserEmailByArtworkId(externalId: number): Promise<string | null> {
  const query = 'SELECT user.email FROM artwork JOIN user ON artwork.user_id = user.id WHERE artwork.external_id = ?';
  const params = [externalId];
  try {
      const rows = await pool.query(query, params);
      // .length only available as mysql.RowDataPacket[] interface
      const rowDataPackets = rows as mysql.RowDataPacket[];
      if (rowDataPackets.length > 0) {
          return rowDataPackets[0].email;
      } else {
          return null;
      }
  } catch (error) {
      console.error('Error retrieving user email:', error);
      throw error;
  }
}

