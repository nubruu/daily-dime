import { Moon, Sun, LogIn, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Header = () => {
    const { preferences, updatePreferences, user, setUser } = useStore();
    const navigate = useNavigate();

    const toggleTheme = () => {
        const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
        updatePreferences({ theme: newTheme });
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <img src="/DailyDime.png" alt="DailyDime Logo" className="w-10 h-10 relative z-10" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                            DailyDime
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {preferences.theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </button>

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors shadow-lg shadow-primary-500/20"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
