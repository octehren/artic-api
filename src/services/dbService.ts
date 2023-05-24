import mysql from 'mysql2/promise';
import { DEFAULT_POOL_CONFIG } from '../config';

export const pool = mysql.createPool(DEFAULT_POOL_CONFIG);

export const createArtwork = async (userId: number, externalId: number): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ? LIMIT 1', [userId]);
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
    const [rows] = await pool.query(query, params);
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

/* returns user Id on successful creation */
export const createUser = async (email: string, password: string): Promise<number> => {
  try {
    const query = 'INSERT INTO user (email, password) VALUES (?, ?)';
    const values = [email, password];

    const [result] = await pool.execute(query, values);
    const userId: number = (result as mysql.RowDataPacket).insertId;

    return userId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// returns id for user based on successful match
export const getUserId = async (email: string, password: string): Promise<number | null> => {
  try {
    const query = 'SELECT id FROM user WHERE email = ? AND password = ?';
    const values = [email, password];

    const [rows] = await pool.query(query, values);
    const rowDataPackets = rows as mysql.RowDataPacket[];

    if (rowDataPackets.length > 0) {
      return rowDataPackets[0].id as number;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    throw error;
  }
};

export const hasDifferentOwner = async (externalArtworkId: number, userId: number): Promise<boolean> => {
  try {
    // fetches the artwork details by externalId from the database, checks if user_id is different
    const [rows] = await pool.query('SELECT * FROM artwork WHERE external_id = ? AND user_id <> ? LIMIT 1', [externalArtworkId,userId]);
    const rowDataPackets = rows as mysql.RowDataPacket[];
    // if record is found and has different user_id, return true
    if (rowDataPackets.length > 0) {
      return rowDataPackets[0]['user_id'] !== userId;
    }
    return false;
  } catch (error) {
    // Handle any errors that occur during the database fetch operation
    console.error('Error fetching artwork:', error);
    throw error;
  }
}

export const getUserArtworks = async (userId: number): Promise<number[]> => {
  try {
    // Fetches the artwork external IDs from the database for the specified user_id
    const [rows] = await pool.query('SELECT external_id FROM artwork WHERE user_id = ?', [userId]);
    const rowDataPackets = rows as mysql.RowDataPacket[];
    // Extract the external IDs from the fetched rows
    const externalIds = rowDataPackets.map((row) => row['external_id']);
    return externalIds;
  } catch (error) {
    // Handle any errors that occur during the database fetch operation
    console.error('Error fetching user artworks:', error);
    throw error;
  }
};


export default {
  createUser,
  hasDifferentOwner,
  createArtwork,
}