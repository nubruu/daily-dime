import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export const Analytics = () => {
    const { transactions, preferences } = useStore();
    const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');

    // Get date range
    const dateRange = useMemo(() => {
        const end = endOfMonth(new Date());
        const monthsBack = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12;
        const start = startOfMonth(subMonths(end, monthsBack - 1));
        return { start, end };
    }, [timeRange]);

    // Monthly comparison data
    const monthlyData = useMemo(() => {
        const months = eachMonthOfInterval(dateRange);

        return months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);

            const monthTransactions = transactions.filter(t => {
                const date = new Date(t.date);
                return date >= monthStart && date <= monthEnd;
            });

            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expenses = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                month: format(month, 'MMM yyyy'),
                income,
                expenses,
                savings: income - expenses,
            };
        });
    }, [transactions, dateRange]);

    // Summary stats
    const summary = useMemo(() => {
        const rangeTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date >= dateRange.start && date <= dateRange.end;
        });

        const totalIncome = rangeTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = rangeTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const avgMonthlyIncome = totalIncome / monthlyData.length;
        const avgMonthlyExpenses = totalExpenses / monthlyData.length;

        return {
            totalIncome,
            totalExpenses,
            netSavings: totalIncome - totalExpenses,
            avgMonthlyIncome,
            avgMonthlyExpenses,
            savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
        };
    }, [transactions, dateRange, monthlyData]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Financial insights and trends
                    </p>
                </div>

                {/* Time Range Selector */}
                <div className="flex space-x-2">
                    {(['3m', '6m', '12m'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${timeRange === range
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                        >
                            {range === '3m' ? '3 Months' : range === '6m' ? '6 Months' : '12 Months'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Income</p>
                    <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-2">
                        {formatCurrency(summary.totalIncome, preferences.currency)}
                    </p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-danger-600 dark:text-danger-400 mt-2">
                        {formatCurrency(summary.totalExpenses, preferences.currency)}
                    </p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Net Savings</p>
                    <p className={`text-2xl font-bold mt-2 ${summary.netSavings >= 0
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-danger-600 dark:text-danger-400'
                        }`}>
                        {formatCurrency(summary.netSavings, preferences.currency)}
                    </p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Savings Rate</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                        {summary.savingsRate.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Monthly Comparison */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Monthly Income vs Expenses
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value, preferences.currency)}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Savings Trend */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Savings Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip formatter={(value: number) => formatCurrency(value, preferences.currency)} />
                        <Line
                            type="monotone"
                            dataKey="savings"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ fill: '#6366f1', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
