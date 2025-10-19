import React, { useState } from 'react';
import type { Article } from '../types';
import { summarizeArticle } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const handleSummarize = async () => {
        if (summary || summaryError) { // Allow hiding summary or retrying on error
            setSummary(null);
            setSummaryError(null);
            if (!summaryError) return; // if it was just hiding, don't re-fetch
        }

        setIsSummarizing(true);
        setSummaryError(null);
        try {
            const generatedSummary = await summarizeArticle(article.title, article.description, article.content);
            setSummary(generatedSummary);
        } catch (error) {
            setSummaryError((error as Error).message);
        } finally {
            setIsSummarizing(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return "Invalid Date";
        }
    };
    
    // Fallback image in case the article's image is invalid
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = 'https://picsum.photos/seed/fallback/400/200';
      e.currentTarget.onerror = null; // Prevent infinite loop if fallback fails
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group">
             {article.urlToImage && (
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="overflow-hidden">
                    <img 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                      src={article.urlToImage} 
                      alt={article.title}
                      onError={handleImageError} 
                    />
                </a>
            )}
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-slate-500 dark:text-slate-400">{article.source.name} &bull; {formatDate(article.publishedAt)}</p>
                <h3 className="text-lg font-bold mt-1 text-slate-800 dark:text-slate-100">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 transition-colors">
                        {article.title}
                    </a>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex-grow line-clamp-3">{article.description}</p>
                
                <div className="mt-4">
                    {summaryError && <p className="text-sm text-red-500 dark:text-red-400 mb-2">{summaryError}</p>}
                    {summary && (
                        <div className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md mb-2">
                            <p className="text-sm text-slate-700 dark:text-slate-200">{summary}</p>
                        </div>
                    )}
                    <button 
                        onClick={handleSummarize} 
                        disabled={isSummarizing}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 hover:from-cyan-200 hover:to-blue-200 dark:from-cyan-900/50 dark:to-blue-900/50 dark:text-cyan-300 dark:hover:from-cyan-900 dark:hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSummarizing ? (
                            <>
                                <SpinnerIcon />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon />
                                <span className="ml-2">{summary ? 'Hide Summary' : summaryError ? 'Retry Summary' : 'AI Summary'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
