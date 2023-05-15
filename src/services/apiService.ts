import axios from 'axios';
import NodeCache from 'node-cache';
import { API_URL, DEFAULT_ARTWORK_FIELDS_FOR_INDEX, DEFAULT_ARTWORK_FIELDS_FOR_SHOW } from '../config'
import { appCache } from '../appCache';

// pass cache as injected dependency to isolate testing cache
export const getArtworks = async (page: number = 1, limit: number = 25, cache:NodeCache = appCache): Promise<any> => {
  const key = `artworks-${page}-${limit}`;
  const cacheContent = cache.get(key);

  if (cacheContent) {
    return cacheContent;
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        page,
        limit,
        fields: DEFAULT_ARTWORK_FIELDS_FOR_INDEX
      }
    });

    const parsedData = response.data.data.map((artwork: any) => {
        return {
            ...artwork,
            originalUrl: `https://www.artic.edu/artworks/${artwork.id}`
        }
    });

    cache.set(key, parsedData, 3600); // cache for 1 hour
    return parsedData
  } catch (error) {
    console.error(error);
    throw error; // throw the error again
  }
};

// pass cache as injected dependency to isolate testing cache
export const getArtwork = async (id: number, cache:NodeCache = appCache): Promise<any> => { // single artwork response is uncached
  const key = `artwork-${id}`;
  const cacheContent = cache.get(key);

  if (cacheContent) {
    return Promise.resolve(cacheContent);
  }

  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      params: {
          fields: DEFAULT_ARTWORK_FIELDS_FOR_SHOW
      }
    });
    const detailedArtwork = response.data.data
    const { thumbnail, ...artworkWithoutThumbnail } = detailedArtwork;
    const artwork: any = {
        ...artworkWithoutThumbnail,
        description: thumbnail.alt_text,
        originalUrl: `https://www.artic.edu/artworks/${artworkWithoutThumbnail.id}`
    }

    cache.set(key, artwork, 3600); // cache for 1 hour
    return artwork;
  } catch (error) {
    console.error(error);
    throw error; // throw the error again
  }
};
  
export default {
  getArtworks,
  getArtwork,
};
