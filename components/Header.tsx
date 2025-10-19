import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../constants';
import { SearchIcon } from './icons/SearchIcon';
import { useTheme } from '../hooks/useTheme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { DesktopIcon } from './icons/DesktopIcon';

interface HeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (searchTerm: string) => void;
  currentSearchTerm: string;
}

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const themes = [
        { name: 'Light', value: 'light', icon: <SunIcon /> },
        { name: 'Dark', value: 'dark', icon: <MoonIcon /> },
        { name: 'System', value: 'system', icon: <DesktopIcon /> },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const CurrentIcon = () => {
        if (theme === 'light') return <SunIcon />;
        if (theme === 'dark') return <MoonIcon />;
        return <DesktopIcon />;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
            >
                <CurrentIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-10">
                    <ul>
                        {themes.map((t) => (
                             <li key={t.value}>
                                <button
                                    onClick={() => {
                                        setTheme(t.value as 'light' | 'dark' | 'system');
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center px-4 py-2 text-sm text-left ${
                                        theme === t.value 
                                        ? 'text-cyan-500 dark:text-cyan-400' 
                                        : 'text-slate-700 dark:text-slate-300'
                                    } hover:bg-slate-100 dark:hover:bg-slate-700`}
                                >
                                    {t.icon}
                                    <span className="ml-2">{t.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, onSearch, currentSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm);

  useEffect(() => {
    setSearchTerm(currentSearchTerm);
  }, [currentSearchTerm]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              AI News Nexus
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your Daily Dose of AI Intelligence</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search news..."
                className="w-full pl-10 pr-4 py-2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                <SearchIcon />
              </button>
            </form>
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-4">
            <nav className="overflow-x-auto pb-2">
            <ul className="flex space-x-2 md:space-x-4">
                {CATEGORIES.map((category) => (
                <li key={category}>
                    <button
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                        activeCategory === category
                        ? 'bg-cyan-500 text-white shadow-md'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                    >
                    {category}
                    </button>
                </li>
                ))}
            </ul>
            </nav>
        </div>
      </div>
    </header>
  );
};