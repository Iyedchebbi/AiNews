import type { Article } from '../types';
import { mockArticles, mockTrendingArticles } from './mockData';

// --- Live API Code (Commented Out Due to API Limits) ---
// The World News API free plan has a very low daily limit (50 points), which
// is quickly exhausted by the app's initial requests, leading to the "402 Payment
// Required" error you are seeing. To ensure the app remains functional for
// development and demonstration, we are using a reliable mock data service below.
// If you upgrade to a paid API key, you can uncomment this section.
/*
import type { WorldNewsApiResponse, WorldNewsApiArticle } from '../types';

const WORLDNEWSAPI_KEY = '4fcf42ce62e848768c7baacf04562f6b';
const API_URL = 'https://api.worldnewsapi.com';


const getSourceNameFromUrl = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace(/^www\./, '').split('.');
    if (parts.length > 1) {
      const name = parts[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return hostname;
  } catch (error) {
    return 'Unknown Source';
  }
};


const mapWorldNewsToArticle = (apiArticle: WorldNewsApiArticle): Article => {
  return {
    source: {
      id: apiArticle.id.toString(),
      name: getSourceNameFromUrl(apiArticle.url),
    },
    author: (apiArticle.authors || []).join(', ') || null,
    title: apiArticle.title,
    description: apiArticle.text,
    url: apiArticle.url,
    urlToImage: apiArticle.image,
    publishedAt: apiArticle.publish_date,
    content: apiArticle.text,
  };
};

const fetchNewsFromApi = async (endpoint: string, queryParams: string): Promise<Article[]> => {
  const url = `${API_URL}${endpoint}?api-key=${WORLDNEWSAPI_KEY}&${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Could not parse error response.' }));
      console.error("API Error Response:", errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData?.message || 'Unknown error'}`);
    }
    const data: WorldNewsApiResponse = await response.json();
    return data.news
      .filter(article => article.image && article.title && article.text)
      .map(mapWorldNewsToArticle);
  } catch (error) {
    console.error("Error fetching news from API:", error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Failed to fetch news. This might be due to a network issue or CORS policy. Please try again later.');
    }
    throw error;
  }
};
*/

// --- Mock Data Implementation ---
// This provides a stable and error-free experience.

const filterMockArticles = (query: string): Article[] => {
    const lowercasedQuery = query.toLowerCase().trim();
    if (!lowercasedQuery) return mockArticles;

    // Simulate filtering for a more realistic search experience
    return mockArticles.filter(article =>
        article.title.toLowerCase().includes(lowercasedQuery) ||
        (article.description && article.description.toLowerCase().includes(lowercasedQuery)) ||
        article.source.name.toLowerCase().includes(lowercasedQuery)
    );
};


export const getNews = async (query: string): Promise<Article[]> => {
  console.log(`Using mock data for query: "${query}"`);
  
  const trimmedQuery = query.trim();
  if (trimmedQuery.length > 0 && trimmedQuery.length < 3) {
    throw new Error("Search term must be at least 3 characters long.");
  }
  
  // Simulate network delay for a realistic loading experience
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return Promise.resolve(filterMockArticles(query));
};

export const getTrendingNews = async (): Promise<Article[]> => {
  console.log('Using mock data for trending news...');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return Promise.resolve(mockTrendingArticles);
};
