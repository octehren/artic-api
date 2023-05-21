import * as http from 'http';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';
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

export const GetRequestingUserId = (): number => {
  return 1; // will get from JWT token later
}