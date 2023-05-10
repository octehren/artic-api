import * as http from 'http';
import * as jwt from 'jsonwebtoken';
import { authenticateRequest } from '../index';

// Mock the secret key for JWT signing
const secretKey = 'your-secret-key';

// Generate a valid JWT token
const validToken = jwt.sign({ username: 'testuser' }, secretKey);

// Generate an invalid JWT token
const invalidToken = jwt.sign({ username: 'testuser' }, 'wrong-secret');

describe('authenticateRequest', () => {
    it('should return true for valid token', () => {
        const req = {
            headers: {
                authorization: `Bearer ${validToken}`,
            },
        } as http.IncomingMessage;

        const isAuthenticated = authenticateRequest(req);
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
