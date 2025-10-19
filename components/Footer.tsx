import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';

export const Footer: React.FC = () => {
  const { lang } = useLanguage();
  return (
    <footer className="bg-slate-200 dark:bg-slate-900/50 py-6">
      <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} AI News Nexus. {translations.footerRights[lang]}</p>
        <p className="text-sm mt-1">{translations.footerDev[lang]} Iyed CHEBBI</p>
      </div>
    </footer>
  );
};