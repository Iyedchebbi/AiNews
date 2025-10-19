import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme') as Theme) || 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };
  
  // Handles direct 'light' or 'dark' theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'light') {
      root.classList.remove('dark');
      setResolvedTheme('light');
    } else if (theme === 'dark') {
      root.classList.add('dark');
      setResolvedTheme('dark');
    }
  }, [theme]);
  
  // Handles 'system' theme and listens for OS changes
  useEffect(() => {
    if (theme !== 'system') {
      return; // Do nothing if the theme is not 'system'
    }

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isDark = e.matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setResolvedTheme(isDark ? 'dark' : 'light');
    };

    handleSystemChange(mediaQuery); // Apply initial system theme

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme]);


  const value = { theme, setTheme, resolvedTheme };

  return React.createElement(
    ThemeContext.Provider,
    { value },
    children
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};