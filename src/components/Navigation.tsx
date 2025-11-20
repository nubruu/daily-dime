import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, HandCoins } from 'lucide-react';

const navItems = [
    { to: '/', icon: Receipt, label: 'Transactions' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/to-take', icon: HandCoins, label: 'To Take' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export const Navigation = () => {
    return (
        <>
            {/* Desktop Navigation (Top) */}
            <nav className="hidden md:block bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${isActive
                                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation (Bottom) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
};
