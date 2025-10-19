import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { NewsList } from './components/NewsList';
import { TrendingNews } from './components/TrendingNews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { getNews, getTrendingNews } from './services/newsService';
import { CATEGORIES } from './constants';
import type { Article } from './types';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [trendingLoading, setTrendingLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Effect for the initial sequential data load to avoid rate-limiting.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setError(null);
        setTrendingLoading(true);
        setLoading(true);

        // 1. Fetch trending news first
        const trending = await getTrendingNews();
        setTrendingArticles(trending);
        setTrendingLoading(false);

        // 2. Then fetch the main articles for the default category
        const mainArticles = await getNews(activeCategory);
        setArticles(mainArticles);
        setLoading(false);

      } catch (err) {
        setError((err as Error).message);
        setTrendingLoading(false);
        setLoading(false);
      } finally {
        setInitialLoadDone(true); // Signal that the initial load is complete
      }
    };
    
    fetchInitialData();
  }, []); // Intentionally empty dependency array to run only once on mount

  const fetchArticles = useCallback(async (category: string, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = search || category;
      const fetchedArticles = await getNews(query);
      setArticles(fetchedArticles);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for handling subsequent updates from user interaction (search/category change).
  useEffect(() => {
    if (!initialLoadDone) {
      return; // Don't run this effect until the initial load is complete
    }
    fetchArticles(activeCategory, searchTerm);
  }, [activeCategory, searchTerm, fetchArticles, initialLoadDone]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setSearchTerm('');
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setActiveCategory('');
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        currentSearchTerm={searchTerm}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <TrendingNews articles={trendingArticles} loading={trendingLoading} />
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                {searchTerm ? `Results for "${searchTerm}"` : `${activeCategory} News`}
            </h2>
            <NewsList articles={articles} loading={loading} error={error} />
        </div>
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default App;
