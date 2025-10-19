import React from 'react';
import type { Article } from '../types';

interface TrendingNewsProps {
  articles: Article[];
  loading: boolean;
}

const TrendingSkeleton: React.FC = () => (
    <div className="flex-shrink-0 w-80 mr-6 bg-white dark:bg-slate-800 rounded-lg shadow-md animate-pulse">
        <div className="w-full h-32 bg-slate-300 dark:bg-slate-700 rounded-t-lg"></div>
        <div className="p-3 space-y-2">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
    </div>
);

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none'; // Hide broken images
};

export const TrendingNews: React.FC<TrendingNewsProps> = ({ articles, loading }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Trending Now</h2>
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => <TrendingSkeleton key={index} />)
                ) : (
                    articles.map(article => (
                        <div key={article.url} className="flex-shrink-0 w-80 mr-6 bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                {article.urlToImage && (
                                    <div className="overflow-hidden">
                                        <img 
                                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
                                            src={article.urlToImage} 
                                            alt={article.title}
                                            onError={handleImageError}
                                        />
                                    </div>
                                )}
                                <div className="p-3">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{article.source.name}</p>
                                    <h3 className="text-md font-semibold mt-1 text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 hover:text-cyan-500 transition-colors">{article.title}</h3>
                                </div>
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
