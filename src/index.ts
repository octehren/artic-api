import * as http from 'http';
import * as url from 'url';

/* begin custom services */
import { authenticateRequest, getAuthForUser } from './services/authService';
import apiService, { getArtworks, getArtwork } from './services/apiService';
/* endof custom services */

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
      case '/login':
        if (req.method === 'POST') {
          try {
            // accepts e-mail and password only on request body
            const { email, password } = JSON.parse(await getRequestBody(req));
            // performs authentication and gets the authorization token
            const authToken = await getAuthForUser(email, password);
            // returns the authorization token in response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token: authToken }));
          } catch (error) {
            console.error('Error during login:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        } else { // non POST req
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
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

async function getRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
}