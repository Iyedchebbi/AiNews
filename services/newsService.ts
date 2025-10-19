import type { Article, WorldNewsApiResponse, WorldNewsApiArticle } from '../types';

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

export const getNews = async (query: string): Promise<Article[]> => {
  const trimmedQuery = query.trim();

  // The API requires the text parameter to be at least 3 characters.
  // We check this here to prevent a 400 Bad Request error.
  if (trimmedQuery.length > 0 && trimmedQuery.length < 3) {
    throw new Error("Search term must be at least 3 characters long.");
  }

  // If the query is empty after trimming, there's nothing to search.
  if (!trimmedQuery) {
    return [];
  }
  
  console.log(`Fetching live news for query: "${trimmedQuery}"`);
  const params = `text=${encodeURIComponent(trimmedQuery)}&language=en&number=20`;
  return fetchNewsFromApi('/search-news', params);
};

export const getTrendingNews = async (): Promise<Article[]> => {
  console.log('Fetching live trending news...');
  const params = `text=technology&language=en&sort=publish-time&sort-direction=DESC&number=10`;
  return fetchNewsFromApi('/search-news', params);
};