import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../store';

export const Header = () => {
    const { preferences, updatePreferences } = useStore();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const theme = preferences.theme === 'system' ? systemTheme : preferences.theme;

        if (theme === 'dark') {
            root.classList.add('dark');
            setIsDark(true);
        } else {
            root.classList.remove('dark');
            setIsDark(false);
        }
    }, [preferences.theme]);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        updatePreferences({ theme: newTheme });
    };

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img src="/src/assets/DailyDime.png" alt="DailyDime Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                        <div>
                            <h1 className="text-xl font-bold text-gradient">DailyDime</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Track Your Finances</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
