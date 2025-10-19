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

  const handleSummarize = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSummarizing(true);
    setSummaryError(null);
    try {
      const result = await summarizeArticle(article.title, article.description);
      setSummary(result);
    } catch (err) {
      setSummaryError("Failed to get summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const placeholderImage = `https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/200`;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl dark:hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 group ring-1 ring-transparent hover:ring-cyan-500"
    >
      <div className="relative overflow-hidden">
        <img
            src={article.urlToImage || placeholderImage}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = placeholderImage; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-4 flex flex-col h-64 justify-between">
        <div>
            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold mb-1">{article.source.name}</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 h-20 overflow-hidden">{article.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{formattedDate}</p>
        </div>

        <div className="mt-4">
          {!summary && !isSummarizing && !summaryError && (
            <button
              onClick={handleSummarize}
              className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md font-semibold text-sm hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              <SparklesIcon />
              <span className="ml-2">AI Summary</span>
            </button>
          )}
          {isSummarizing && (
            <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              <SpinnerIcon />
              <span>Generating summary...</span>
            </div>
          )}
          {summary && (
            <div className="p-3 bg-cyan-50 dark:bg-slate-900/50 rounded-md ring-1 ring-cyan-200 dark:ring-slate-700">
              <p className="text-sm text-cyan-800 dark:text-cyan-300">{summary}</p>
            </div>
          )}
           {summaryError && (
             <div className="p-3 bg-red-50 dark:bg-red-900/50 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{summaryError}</p>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};