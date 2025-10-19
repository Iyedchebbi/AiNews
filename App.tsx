import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { NewsList } from './components/NewsList';
import { TrendingNews } from './components/TrendingNews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { getNews, getTrendingNews } from './services/newsService';
import { CATEGORIES, CATEGORY_KEYS } from './constants';
import { useLanguage } from './hooks/useLanguage';
import { translations } from './translations';
import type { Article } from './types';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [trendingLoading, setTrendingLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(CATEGORY_KEYS[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const { lang } = useLanguage();

  const translatedCategories = CATEGORY_KEYS.map(key => CATEGORIES[key][lang]);

  // Effect for the initial sequential data load to avoid rate-limiting.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setError(null);
        setTrendingLoading(true);
        setLoading(true);

        const trending = await getTrendingNews();
        setTrendingArticles(trending);
        setTrendingLoading(false);

        const defaultCategory = CATEGORIES[CATEGORY_KEYS[0]].en; // Always fetch default with English term
        const mainArticles = await getNews(defaultCategory);
        setArticles(mainArticles);
        setLoading(false);

      } catch (err) {
        setError((err as Error).message);
        setTrendingLoading(false);
        setLoading(false);
      } finally {
        setInitialLoadDone(true);
      }
    };
    
    fetchInitialData();
  }, []);

  const fetchArticles = useCallback(async (categoryKey: string, search: string) => {
    try {
      setLoading(true);
      setError(null);
      // Use the English term for API queries to ensure consistency
      const apiQuery = search || CATEGORIES[categoryKey]?.en || CATEGORIES[CATEGORY_KEYS[0]].en;
      const fetchedArticles = await getNews(apiQuery);
      setArticles(fetchedArticles);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone) return;
    if (!activeCategoryKey && !searchTerm) return;
    
    fetchArticles(activeCategoryKey, searchTerm);
  }, [activeCategoryKey, searchTerm, fetchArticles, initialLoadDone]);

  const handleCategoryChange = useCallback((categoryKey: string) => {
    setActiveCategoryKey(categoryKey);
    setSearchTerm('');
  }, []);

  const handleSearch = useCallback((term: string) => {
    if (term) {
      setSearchTerm(term);
      setActiveCategoryKey('');
    } else {
      setSearchTerm('');
      setActiveCategoryKey(CATEGORY_KEYS[0]);
    }
  }, []);

  const getHeadline = () => {
    if (searchTerm) {
      return `${translations.resultsFor[lang]} "${searchTerm}"`;
    }
    if (activeCategoryKey) {
      return `${CATEGORIES[activeCategoryKey][lang]} ${translations.news[lang]}`;
    }
    return `AI News Nexus`;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        activeCategoryKey={activeCategoryKey}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        currentSearchTerm={searchTerm}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <TrendingNews articles={trendingArticles} loading={trendingLoading} />
        <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-600">
                {getHeadline()}
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