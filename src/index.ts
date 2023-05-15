import * as http from 'http';
import * as url from 'url';

/* begin custom services */
//import { authenticateRequest } from './services/authService';
import apiService, { getArtworks, getArtwork } from './services/apiService';
/* endof custom services */


// Reference for auth; work on it later.
// const server = http.createServer((req, res) => {
//   const { pathname } = url.parse(req.url || '', true);

//   if (pathname === '/protected') {
//     if (authenticateRequest(req)) {
//       res.writeHead(200, { 'Content-Type': 'text/plain' });
//       res.end('Welcome to the protected route.');
//     } else {
//       res.writeHead(401, { 'Content-Type': 'text/plain' });
//       res.end('Unauthorized.');
//     }
//   } else if (pathname === '/public') {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Welcome to the public route.');
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Not found.');
//   }
// });

const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(async (req, res) => {
  const requestUrl : url.UrlWithParsedQuery = url.parse(req.url as string, true);
  
  switch(requestUrl.pathname) {
    case '/artworks':
      const page = requestUrl.query.page ? Number(requestUrl.query.page) : 1;
      const limit = requestUrl.query.perPage ? Number(requestUrl.query.perPage) : 10;
      const data = await apiService.getArtworks(page, limit);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data, null, 2)); // prettifies response
      break;
    case '/artwork':
      const id = requestUrl.query.id ? Number(requestUrl.query.id) : null;
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Artwork id is required' }));
      } else {
        const artwork = await apiService.getArtwork(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(artwork, null, 2)); // prettifies response
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const port = process.env.PORT || "3000";

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});