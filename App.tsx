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

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setTrendingLoading(true);
        const fetchedArticles = await getTrendingNews();
        setTrendingArticles(fetchedArticles);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const fetchArticles = useCallback(async (category: string, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = search || category;
      const fetchedArticles = await getNews(query);
      
      if (search) {
        // Simple client-side search simulation
        const filtered = fetchedArticles.filter(article => 
          article.title.toLowerCase().includes(search.toLowerCase()) ||
          (article.description && article.description.toLowerCase().includes(search.toLowerCase()))
        );
        setArticles(filtered);
      } else {
        setArticles(fetchedArticles);
      }

    } catch (err)
 {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(activeCategory, searchTerm);
  }, [activeCategory, searchTerm, fetchArticles]);

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