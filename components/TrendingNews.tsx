import React from 'react';
import type { Article } from '../types';

interface TrendingNewsProps {
  articles: Article[];
  loading: boolean;
}

const TrendingSkeletonCard: React.FC<{ isHero?: boolean }> = ({ isHero = false }) => (
    <div className={`rounded-lg shadow-md overflow-hidden animate-pulse bg-white dark:bg-slate-800 ${isHero ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
        <div className={`bg-slate-300 dark:bg-slate-700 ${isHero ? 'w-full h-full min-h-[20rem]' : 'w-full h-40'}`}></div>
        { !isHero && <div className="p-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
            <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
        </div> }
    </div>
);

export const TrendingNews: React.FC<TrendingNewsProps> = ({ articles, loading }) => {
  if (articles.length === 0 && !loading) {
    return null; // Don't show the section if there are no trending articles
  }

  const heroArticle = articles[0];
  const otherArticles = articles.slice(1, 5);

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Trending Now</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-6 h-auto lg:h-[32rem]">
        {loading ? (
            <>
                <TrendingSkeletonCard isHero />
                {Array.from({ length: 4 }).map((_, index) => <TrendingSkeletonCard key={index} />)}
            </>
        ) : (
            <>
                {/* Hero Article */}
                <a
                    key={heroArticle.url}
                    href={heroArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lg:col-span-2 lg:row-span-2 rounded-lg overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 group relative"
                >
                    <img
                        src={heroArticle.urlToImage || `https://picsum.photos/seed/${encodeURIComponent(heroArticle.title)}/800/600`}
                        alt={heroArticle.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(heroArticle.title)}/800/600`; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <p className="text-sm text-cyan-300 font-medium">{heroArticle.source.name}</p>
                        <h3 className="text-2xl font-bold text-white leading-tight mt-1">{heroArticle.title}</h3>
                    </div>
                </a>
                {/* Other Articles */}
                {otherArticles.map(article => (
                     <a
                        key={article.url}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 group relative"
                    >
                        <img
                            src={article.urlToImage || `https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/300`}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/300`; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                             <p className="text-xs text-cyan-300 font-medium">{article.source.name}</p>
                            <h3 className="text-md font-bold text-white leading-tight">{article.title}</h3>
                        </div>
                    </a>
                ))}
            </>
        )}
      </div>
    </div>
  );
};