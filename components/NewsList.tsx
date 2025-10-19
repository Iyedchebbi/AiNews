import React from 'react';
import { NewsCard } from './NewsCard';
import type { Article } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';

interface NewsListProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const SkeletonCard: React.FC = () => (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg overflow-hidden shadow-md animate-pulse">
        <div className="w-full h-48 bg-slate-300 dark:bg-slate-700"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded mt-4"></div>
        </div>
    </div>
);

export const NewsList: React.FC<NewsListProps> = ({ articles, loading, error }) => {
  const { lang } = useLanguage();

  if (error) {
    return (
      <div className="text-center py-10 px-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <h3 className="text-xl font-semibold text-red-400">{translations.errorOccurred[lang]}</h3>
        <p className="text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">{translations.noArticlesFound[lang]}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{translations.noArticlesFoundDesc[lang]}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <NewsCard key={article.url} article={article} />
      ))}
    </div>
  );
};