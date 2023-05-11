import * as http from 'http';
import * as url from 'url';

/* begin custom services */
import { authenticateRequest } from './services/authService';
/* endof custom services */



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
