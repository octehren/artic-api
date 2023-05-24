import * as http from 'http';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';
import { getUserId } from './dbService';
// Create a secret key for JWT signing
const secretKey = JWT_SECRET;

// Function to authenticate incoming requests using JWT
export const authenticateRequest = (req: http.IncomingMessage): boolean => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token: string = authHeader.split(' ')[1]; // Extract the JWT token from the header

    try {
      jwt.verify(token, secretKey); // Verify the token
      return true;
    } catch (error) {
      console.error('Invalid token:', error.message);
    }
  }

  return false;
};

// issues token to login user, expires in 30 min
export const issueToken = (userId: number): string => {
  const payload = { 
    userId,
    exp: Math.floor(Date.now() / 1000) + 1800, // expires in 30 min
  }
  try {
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw error;
  }
};


export const getAuthTokenForUser = async (email: string, password: string): Promise<string> => {
  try {
    const userId: number = await getUserId(email, password);
    const token: string = issueToken(userId);
    return token;
  } catch (error) {
    console.error('Error getting authentication for user:', error);
    throw error;
  }
};


export const currentUserId = (req: http.IncomingMessage): number => {
  const authHeader = req.headers.authorization;
  const token : string = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const payload = decoded as { [key: string]: any };
    return payload.userId;
  } catch (error) {
    console.error('Error decoding JWT:', error);
  }
}

export default {
  authenticateRequest,
  currentUserId,
  getAuthTokenForUser,
}