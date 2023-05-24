import * as http from 'http';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { authenticateRequest, issueToken } from '../../services/authService';


const secretKey = JWT_SECRET;
// Generates a valid JWT token
const validToken : string = jwt.sign({ username: 'testuser' }, secretKey);

// Generate an invalid JWT token
const invalidToken : string = jwt.sign({ username: 'testuser' }, 'wrong-secret');

describe('authenticateRequest', () => {
    it('should return true for valid token', () => {
        const req = {
            headers: {
                authorization: `Bearer ${validToken}`,
            },
        } as http.IncomingMessage;

        const isAuthenticated : boolean = authenticateRequest(req);
        expect(isAuthenticated).toBeTruthy();
    });

    it('should return false for invalid token', () => {
        const req = {
            headers: {
                authorization: `Bearer ${invalidToken}`,
            },
        } as http.IncomingMessage;

        const isAuthenticated = authenticateRequest(req);
        expect(isAuthenticated).toBeFalsy();
    });

    it('should return false for missing token', () => {
        const req = {
            headers: {},
        } as http.IncomingMessage;

        const isAuthenticated = authenticateRequest(req);
        expect(isAuthenticated).toBeFalsy();
    });
});

describe('Token Expiration Test', () => {
    test('Token should expire in 30 minutes', () => {
      const userId = 123;
  
      // Generate the token with an expiration time of 30 minutes
      const token = issueToken(userId);
  
      // Wait for 31 minutes
      const thirtyOneMinutesFromNow = Math.floor(Date.now() / 1000) + 1860;
      jest.spyOn(Date, 'now').mockReturnValue(thirtyOneMinutesFromNow * 1000);
  
      // Attempt to verify the expired token
      try {
        jwt.verify(token, JWT_SECRET);
      } catch (error) {
        // Expect the error to be thrown due to token expiration
        expect(error.name).toBe('TokenExpiredError');
        expect(error.message).toBe('jwt expired');
      }
  
      // Restore the original Date.now() function
      jest.spyOn(Date, 'now').mockRestore();
    });
  });
