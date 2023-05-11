// export const API_URL: string = 'api.com;
// export const DATABASE_URL = 'mysql';
// using a placeholder value as a json web token is meant only for tests, this should never be in a production env as it allows for a hard-coded token.
export const JWT_SECRET: string = process.env.JWT_SECRET || 'ssshhhhh,secret!!!';
