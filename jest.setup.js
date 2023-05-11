require('dotenv').config(); // loads env vars for tests
console.log("SECRET:", process.env.JWT_SECRET);
