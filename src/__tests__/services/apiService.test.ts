import axios from 'axios';
import NodeCache from 'node-cache';
import apiService from '../../services/apiService';
import { API_URL, DEFAULT_ARTWORK_FIELDS_FOR_INDEX, DEFAULT_ARTWORK_FIELDS_FOR_SHOW } from '../../config'

jest.mock('axios');

const mockAxios = axios as jest.Mocked<typeof axios>;
const testCache = new NodeCache();

afterEach(() => {
  testCache.flushAll();
});

describe('getArtworks', () => {

  it('fetches artworks from the API when cache is empty', async () => {
    const mockData = {
      data: {
        data: [
          { id: 1, title: 'Artwork 1' }
        ],
      },
    };
    mockAxios.get.mockResolvedValueOnce(mockData);
    const result = await apiService.getArtworks(1, 1, testCache);

    const cachedValue = testCache.get('artworks-1-1');
    expect(cachedValue).toEqual(result);
  });

  it('fetches artworks from the cache when cache is not empty', async () => {
    const cachedArtworks = [
      { id: 1, title: 'Artwork 1', originalUrl: 'https://www.artic.edu/artworks/1' }
    ];
    testCache.set('artworks-1-1', cachedArtworks);
    const result = await apiService.getArtworks(1, 1, testCache);

    expect(result).toEqual(cachedArtworks);
  });

  it('throws an error when API call fails', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('API Error'));
    await expect(apiService.getArtworks(1, 1)).rejects.toThrow('API Error');
  });
});

describe('getArtwork', () => {

  it('fetches artwork from the API when cache is empty', async () => {
    const mockArtworkData = {
      id: 1,
      title: 'Artwork 1',
      thumbnail: {
        alt_text: 'description'
      }
    };
  
    mockAxios.get.mockResolvedValueOnce({
      data: {
        data: mockArtworkData
      }
    });
  
    const result = await apiService.getArtwork(1, testCache);
    const cachedValue = testCache.get('artwork-1');
    expect(cachedValue).toEqual(result);
  });

  it('fetches artwork from the cache when cache is not empty', async () => {
    const cachedArtwork = {
      id: 1,
      title: 'Artwork 1',
      description: 'description',
      originalUrl: 'https://www.artic.edu/artworks/1'
    };
    testCache.set('artwork-1', cachedArtwork);
    const result = await apiService.getArtwork(1, testCache);

    expect(result).toEqual(cachedArtwork);
  });

  it('throws an error when API call fails', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('API Error'));
    try {
      await expect(apiService.getArtwork(1)).rejects.toThrow('API Error');
    } catch(error) {
      if (error.message !== 'API Error') {
        console.log("ERRORRRRRR:\n\n\n\n", error.message)
        // else, does nothing as API Erroris expected
        throw error
      }
    }
  });
});
