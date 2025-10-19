import React, { useState } from 'react';

export const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Subscribing email: ${email}`);
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <section className="bg-slate-100 dark:bg-slate-800/50 py-12 mt-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-2">Stay Ahead of the Curve</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-2xl mx-auto">Subscribe to our newsletter for the latest AI news and insights delivered straight to your inbox.</p>
                {subscribed ? (
                     <p className="text-green-600 dark:text-green-400 font-semibold">Thank you for subscribing!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="flex-grow px-4 py-2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                        />
                        <button type="submit" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-r-md hover:from-cyan-600 hover:to-blue-700 transition-all">
                            Subscribe
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};