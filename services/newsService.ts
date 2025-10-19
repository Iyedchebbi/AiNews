import type { Article } from '../types';
import { mockArticles, mockTrendingArticles } from './mockData';

const simulateNetworkDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

export const getNews = async (query: string): Promise<Article[]> => {
    console.log(`Fetching mock news for query: ${query}`);
    await simulateNetworkDelay(1000);
    // In a real app, you would filter based on the query. Here we just return the full list.
    return mockArticles;
};

export const getTrendingNews = async (): Promise<Article[]> => {
    console.log('Fetching mock trending news');
    await simulateNetworkDelay(800);
    return mockTrendingArticles;
};