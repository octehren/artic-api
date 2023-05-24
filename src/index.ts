import * as http from 'http';
import * as url from 'url';

/* begin custom services */
import authService from './services/authService';
import apiService from './services/apiService';
import dbService from './services/dbService';
/* end of custom services */

const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(async (req, res) => {
  try {
    const requestUrl: url.UrlWithParsedQuery = url.parse(req.url as string, true);
    switch (requestUrl.pathname) {
      case '/artworks':
        const page = requestUrl.query.page ? Number(requestUrl.query.page) : 1;
        const limit = requestUrl.query.perPage ? Number(requestUrl.query.perPage) : 10;
        const data = await apiService.getArtworks(page, limit);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2)); // prettifies response
        break;
      case '/artwork':
        const artworkId = requestUrl.query.id ? Number(requestUrl.query.id) : null;
        if (!artworkId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Artwork id is required' }));
        } else {
          const artwork = await apiService.getArtwork(artworkId);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(artwork, null, 2)); // prettifies response
        }
        break;
      case '/acquire':
        const validUser = authService.authenticateRequest(req);
        const acquireId = requestUrl.query.id ? Number(requestUrl.query.id) : null;
        if (!acquireId || !validUser) {
          const errorCode = validUser ? 400 : 401;
          res.writeHead(errorCode, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Artwork id is required and user must be logged in to acquire.' }));
        } else {
          const acquirerUserId = await authService.currentUserId(req);
          const hasDifferentOwner = await dbService.hasDifferentOwner(acquireId, acquirerUserId);
          if (hasDifferentOwner) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Trying to get what isn't yours, huh?` })); // prettifies response
          } else { // either already acquired by or ready to be acquired by the user
            dbService.createArtwork(acquirerUserId, acquireId);
            const artwork = await apiService.getArtwork(acquireId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(artwork, null, 2)); // prettifies response
          }
        }
        break;
      case '/myArtworks':
        // user logged in
        if (!authService.authenticateRequest(req)) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'You must log-in to browser your owned artworks.' }));
        } else {
          const userId = authService.currentUserId(req);
          const userArtworks = await dbService.getUserArtworks(userId);
          res.writeHead(200, { 'Content-Type': 'application-json' });
          res.end(JSON.stringify({ message: `Showing artworks for user ${userId}`, artworks: userArtworks }));
        }
        break;
      case '/login':
        if (req.method === 'POST') {
          try {
            // accepts e-mail and password only in the request body
            const { email, password } = JSON.parse(await getRequestBody(req));
            // performs authentication and gets the authorization token
            const authToken = await authService.getAuthTokenForUser(email, password);
            // returns the authorization token in the response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token: authToken }));
          } catch (error) {
            console.error('Error during login:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        } else { // non-POST request
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        break;
      case '/signup':
        if (req.method === 'POST') {
          try {
            // accepts e-mail and password only in the request body
            const { email, password } = JSON.parse(await getRequestBody(req));
            // creates user, throws error if existent
            await dbService.createUser(email, password);
            // performs authentication and gets the authorization token
            const authToken = await authService.getAuthTokenForUser(email, password);
            // returns the authorization token in the response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token: authToken }));
          } catch (error) {
            console.error('Error during login:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        } else { // non-POST request
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
        break;
      default:
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
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

export default server;