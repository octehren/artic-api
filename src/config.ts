export const API_URL: string = 'https://api.artic.edu/api/v1/artworks' // /{id} for show, ?page={pageNum}&limit={itemsOnPage} for index
export const DEFAULT_ARTWORK_FIELDS_FOR_INDEX: string = [
    'id',
    'title',
    'artist_display',
    'date_display',
    'has_not_been_viewed_much'
].join(',')

// @ts-ignore
export const DEFAULT_ARTWORK_FIELDS_FOR_SHOW: string = [
    'id',
    'title',
    'artist_display',
    'date_display',
    'has_not_been_viewed_much',
    'alt_titles',
    'thumbnail',
    'medium_display',
    'exhibition_history'
].join(',')

/******* DB CONFIG *******/
export const MYSQL_HOST = process.env.MYSQL_HOST || 'db';
export const MYSQL_USER = process.env.MYSQL_USER || 'artic-api-user';
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'pwrd';
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'artic-api';
export const DEFAULT_POOL_CONFIG = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

/******* ENDOF DB CONFIG *******/

// using a placeholder value as a json web token is meant only for tests, this should never be in a production env as it allows for a hard-coded token.
export const JWT_SECRET: string = process.env.JWT_SECRET || 'ssshhhhh,secret!!!';