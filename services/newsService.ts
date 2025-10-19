import type { Article } from '../types';
import { mockArticles, mockTrendingArticles } from './mockData';


// --- MOCK DATA IMPLEMENTATION ---
// This is active to prevent app crashes due to API rate limits.
// The app is fully functional with this mock data.

/**
 * Simulates fetching general news articles.
 * @param _query - The search term or category (ignored for mock data).
 * @returns A promise that resolves to an array of mock articles after a short delay.
 */
export const getNews = async (_query: string): Promise<Article[]> => {
  console.log("Using mock data for general news.");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockArticles);
    }, 500);
  });
};

/**
 * Simulates fetching trending news articles.
 * @returns A promise that resolves to an array of mock trending articles after a short delay.
 */
export const getTrendingNews = async (): Promise<Article[]> => {
  console.log("Using mock data for trending news.");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockTrendingArticles);
    }, 500);
  });
};


// --- LIVE API IMPLEMENTATION (Currently commented out) ---
// To use this, you will need a valid, active RapidAPI key that has not exceeded its quota.
// 1. Uncomment the code below.
// 2. Replace the placeholder with your new key.
// 3. Comment out the "MOCK DATA IMPLEMENTATION" section above.
/*
import type { Article, NewsApiLiteArticle, NewsApiLiteResponse } from '../types';

// TODO: Replace with your valid RapidAPI Key.
const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY_HERE'; 
const API_HOST = 'news-api-lite.p.rapidapi.com';
// FIX: Corrected the API URL. The path is at the root, not '/news-api-lite'.
const API_URL = `https://${API_HOST}`;

const mapToArticle = (apiArticle: NewsApiLiteArticle): Article => {
  return {
    source: {
      id: apiArticle.id,
      name: apiArticle.source_country || 'Unknown Source',
    },
    author: apiArticle.author || null,
    title: apiArticle.title,
    description: apiArticle.description,
    url: apiArticle.url,
    urlToImage: apiArticle.image,
    publishedAt: apiArticle.published_at,
    content: null,
  };
};

const fetchFromApi = async (query: string): Promise<Article[]> => {
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'YOUR_RAPIDAPI_KEY_HERE') {
        throw new Error("Missing API Key: Please add your RapidAPI Key to services/newsService.ts.");
    }

    const url = `${API_URL}?q=${encodeURIComponent(query)}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': API_HOST,
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error(`API request failed with status ${response.status}. See console for details.`);
        }
        const data: NewsApiLiteResponse = await response.json();
        return data.map(mapToArticle);
    } catch (error) {
        console.error("Error fetching news from API:", error);
        throw error;
    }
};

export const getNews = async (query: string): Promise<Article[]> => {
  return fetchFromApi(query);
};

export const getTrendingNews = async (): Promise<Article[]> => {
  return fetchFromApi('AI Technology');
};
*/