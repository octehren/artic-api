# Artwork Browser & Simplified Shop

## Starting App (Production)
`docker compose up`

## Instructions
- `/artworks` Check list of artworks (optional page & perPage params): 
`curl -X GET "http://localhost:3000/artworks?page=100&perPage=2"`
(replace values for page & perPage params; default perPage = 25)
- `/artwork` Check artwork (mandatory id param):
`curl -X GET "http://localhost:3000/artwork?id=122159"`
- `/login` Logins, receives auth token (must send email & password on request body):
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "user1@email.com", "password": "password"}' http://localhost:3000/login
```
- `/signup` Signs up, receives auth token (must send email & password on request body):
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "user1000@email.com", "password": "password"}' http://localhost:3000/signup
```
- `/acquire` Acquire artwork (mandatory id param for artwork and auth token on header):
Replace \<token> with value received on login/signup.
`curl -X POST 'localhost:3000/acquire?id=122159' -H 'Authorization: Bearer <token>'`
Ex:
`curl -X POST 'localhost:3000/acquire?id=122159' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTY4NDg5NTUzNSwiaWF0IjoxNjg0ODkzNzM1fQ.4FequD9pM5jbpWhG38LV51rUoQbvVLj4m9bv6iwde7Q'`
- `/myArtworks` Browser my acquired artworks (mandatory auth token on header):
`curl -X GET 'localhost:3000/myArtworks' -H 'Authorization: Bearer <token>'`

### Testing
Start dev container:
`docker-compose -f docker-compose.dev.yml up --build`
Run tests:
`docker-compose -f docker-compose.dev.yml exec app npm test` 

## Dev Milestones

INITIAL SETUP
- [x] Add tests, lint
- [x] Refactor auth into its own service
- [x] Add preliminary Dockerfile
- [x] Add preliminary docker-compose file with the app and a MySQL service
API SERVICE
- [x] Add API service (index of artworks + pagination & perPage, show individual artwork)
- [x] Add tests for the API service
DATABASE SERVICE
- [x] Add database creation, seeding (fields for artwork, user, purchases)
- [x] Add database service (implement purchasing logic, owner of artwork on individual artwork page)
- [x] Add user creation functionality
- [x] Add owner e-mail to individual artwork
- [x] Add tests for database service
AUTH SERVICE
- [x] Add signup functionality (should return JWT token)
- [x] Add auth service (login method, purchasing only for authenticated users, forbidden to purchase acquired artwork)
- [x] Add tests for auth service
- [x] Add routes (index of artworks with pagination, individual artwork showing owner if existing, login, *auth* purchase)
WRAP-UP
- [x] Add myArtworks route
- [x] Add integration tests for routes (login, sign-up, purchase)
- [x] Populate this README with instructions on how to run the app


## ARTIC API
You can take a look at the ARTIC API documentation here:
http://api.artic.edu/docs/#introduction.
This API doesn’t use authentication for the endpoints you need to use and does not have
endpoints for buying an artwork either, these features will be implemented only in your API.

## Authentication
Implement authentication using JSON Web Tokens with a 30-min invalidation time.
You don’t need to create processes for registering new users, just seed the database with
users “user1@email.com” and “user2@email.com”. Both users should have the password
“password”.

## Artworks
Implement 2 artwork endpoints, one that can retrieve a single artwork by its ID and another
that can retrieve paginated artworks. You need to provide an option to set the page number
and page size.
An artwork needs to have an ID, title, author, and thumbnail fields if they exist.


## Purchasing Artworks
Implement an endpoint for buying an artwork and another for listing all artworks owned by
the user. Only one user can buy an artwork. You don’t need to implement the checkout
process or add prices to the artworks, the purchase is immediate if the artwork doesn’t
have an owner.

## Database
Use MySQL as your database management system. You should save the purchases in the database.


## Other Requirements
Create a docker-compose.yml file that can be used to start the application’s “production”
version on a host machine where only Docker is installed and there are no other
development tools available. In other words, make the app runnable via “docker compose
up” without host machine dependencies. You can pack dependencies in your containers as
you see fit.
Write tests for your API. It’s not a requirement to reach a 100% in coverage, cover areas
with tests as it makes sense to you.
You can use 3rd-party dependencies to implement parts of your application.
You don’t need to implement a client for this task, only an API.