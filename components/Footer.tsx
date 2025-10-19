import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-200 dark:bg-slate-900 py-6">
      <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} AI News Nexus. All rights reserved.</p>
        <p className="text-sm mt-1">Just Developed by Iyed CHEBBI</p>
      </div>
    </footer>
  );
};