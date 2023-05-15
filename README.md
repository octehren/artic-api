# Artwork Browser & Simplified Shop

## Instructions
- Check list of artworks: `curl -X GET "http://localhost:3000/artworks?page=100&perPage=2"` (replace values for page & perPage params; default perPage = 25)
- Check artwork:

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
- [ ] Add database creation, seeding (fields for artwork, user, purchases and JWTs strings + expirations)
- [ ] Add database service (implement purchasing logic, JWT creation, owner of artwork on individual artwork page)
- [ ] Add tests for database service
AUTH SERVICE
- [ ] Add auth service (login & logout method, purchasing only for authenticated users, forbidden to purchase acquired artwork)
- [ ] Add tests for auth service
- [ ] Add routes (index of artworks with pagination, individual artwork showing owner if existing, login, *auth* logout, *auth* purchase)
WRAP-UP
- [ ] Add integration tests for routes
- [ ] Populate this README with instructions on how to run the app


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
Use MySQL as your database management system. You should save the purchases in the
database.


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