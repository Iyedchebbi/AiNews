import React, { useState } from 'react';
import type { Article } from '../types';
import { summarizeArticle } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const { lang } = useLanguage();

    const handleSummarize = async () => {
        if (summary || summaryError) { 
            setSummary(null);
            setSummaryError(null);
            if (!summaryError) return; 
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
            return new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return "Invalid Date";
        }
    };
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = 'https://picsum.photos/seed/fallback/400/200';
      e.currentTarget.onerror = null;
    };

    const getButtonText = () => {
        if (summary) return translations.hideSummary[lang];
        if (summaryError) return translations.retrySummary[lang];
        return translations.aiSummary[lang];
    }

    return (
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-violet-500/20 transition-all duration-300 flex flex-col group ring-1 ring-slate-900/5 dark:ring-white/10 dark:hover:ring-violet-500">
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
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs text-slate-500 dark:text-slate-400">{article.source.name} &bull; {formatDate(article.publishedAt)}</p>
                <h3 className="text-lg font-bold mt-1 text-slate-800 dark:text-slate-100">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-violet-500 transition-colors">
                        {article.title}
                    </a>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex-grow line-clamp-3">{article.description}</p>
                
                <div className="mt-4">
                    {summaryError && <p className="text-sm text-red-500 dark:text-red-400 mb-2">{summaryError}</p>}
                    {summary && (
                        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-md mb-2">
                            <p className="text-sm text-slate-700 dark:text-slate-200">{summary}</p>
                        </div>
                    )}
                    <button 
                        onClick={handleSummarize} 
                        disabled={isSummarizing}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSummarizing ? (
                            <>
                                <SpinnerIcon />
                                <span>{translations.generating[lang]}</span>
                            </>
                        ) : (
                            <>
                                <SparklesIcon />
                                <span className="ml-2">{getButtonText()}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};