import * as http from 'http';
import * as url from 'url';
import * as jwt from 'jsonwebtoken';

// Create a secret key for JWT signing
const secretKey = 'sssshhhhhhhh';

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

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url || '', true);

  if (pathname === '/protected') {
    if (authenticateRequest(req)) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Welcome to the protected route.');
    } else {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized.');
    }
  } else if (pathname === '/public') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the public route.');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found.');
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
