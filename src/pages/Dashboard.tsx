import { useMemo } from 'react';
import { useStore } from '../store';
import { formatCurrency, getCurrentMonth } from '../utils/helpers';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useState } from 'react';
import { AddTransactionModal } from '../components/AddTransactionModal';

export const Dashboard = () => {
    const { transactions, preferences } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentMonth = getCurrentMonth();

    // Calculate summary for current month
    const summary = useMemo(() => {
        const monthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date >= currentMonth.start && date <= currentMonth.end;
        });

        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            savings: income - expenses,
        };
    }, [transactions, currentMonth]);

    // Daily trend data for line chart
    const trendData = useMemo(() => {
        const days = eachDayOfInterval({
            start: startOfMonth(new Date()),
            end: endOfMonth(new Date()),
        });

        return days.map(day => {
            const dayTransactions = transactions.filter(t => {
                const tDate = new Date(t.date);
                return format(tDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
            });

            const income = dayTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expenses = dayTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                date: format(day, 'MMM dd'),
                income,
                expenses,
            };
        }).filter(d => d.income > 0 || d.expenses > 0);
    }, [transactions]);

    // Recent transactions
    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [transactions]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {format(new Date(), 'MMMM yyyy')}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                {/* Income Card */}
                <div className="card card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Income</p>
                            <p className="text-3xl font-bold text-success-600 dark:text-success-400 mt-2">
                                {formatCurrency(summary.income, preferences.currency)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-400" />
                        </div>
                    </div>
                </div>

                {/* Expenses Card */}
                <div className="card card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Expenses</p>
                            <p className="text-3xl font-bold text-danger-600 dark:text-danger-400 mt-2">
                                {formatCurrency(summary.expenses, preferences.currency)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-danger-100 dark:bg-danger-900/30 rounded-xl flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-danger-600 dark:text-danger-400" />
                        </div>
                    </div>
                </div>

                {/* Savings Card */}
                <div className="card card-hover">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Net Savings</p>
                            <p className={`text-3xl font-bold mt-2 ${summary.savings >= 0
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-danger-600 dark:text-danger-400'
                                }`}>
                                {formatCurrency(summary.savings, preferences.currency)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="card animate-scale-in delay-200">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Monthly Trend
                </h2>
                {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip formatter={(value: number) => formatCurrency(value, preferences.currency)} />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No transaction data for this month
                    </div>
                )}
            </div>

            {/* Recent Transactions */}
            <div className="card animate-slide-up delay-300">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Transactions
                </h2>
                {recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {recentTransactions.map((transaction) => {
                            return (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'income'
                                            ? 'bg-success-100 dark:bg-success-900/30'
                                            : 'bg-danger-100 dark:bg-danger-900/30'
                                            }`}>
                                            <span className="text-xl">
                                                {transaction.type === 'income' ? '💰' : '💸'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {transaction.description}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`font-bold ${transaction.type === 'income'
                                        ? 'text-success-600 dark:text-success-400'
                                        : 'text-danger-600 dark:text-danger-400'
                                        }`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount, preferences.currency)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>No transactions yet</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn btn-primary mt-4"
                        >
                            Add Your First Transaction
                        </button>
                    </div>
                )}
            </div>

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
