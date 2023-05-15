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
export const DATABASE_URL = 'mysql';

// using a placeholder value as a json web token is meant only for tests, this should never be in a production env as it allows for a hard-coded token.
// @ts-ignore
export const JWT_SECRET: string = process.env.JWT_SECRET || 'ssshhhhh,secret!!!';