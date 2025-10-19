import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';

export const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const { lang } = useLanguage();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Subscribing email: ${email}`);
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <section className="bg-slate-100 dark:bg-slate-900/50 py-12 mt-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-2">{translations.newsletterTitle[lang]}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-2xl mx-auto">{translations.newsletterDesc[lang]}</p>
                {subscribed ? (
                     <p className="text-green-600 dark:text-green-400 font-semibold">{translations.newsletterSuccess[lang]}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={translations.newsletterPlaceholder[lang]}
                            required
                            className="flex-grow px-4 py-2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                        />
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-r-md hover:from-violet-700 hover:to-purple-700 transition-all">
                            {translations.newsletterButton[lang]}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};