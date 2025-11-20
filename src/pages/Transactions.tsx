import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Plus, Search, Trash2 } from 'lucide-react';
import { AddTransactionModal } from '../components/AddTransactionModal';

export const Transactions = () => {
    const { transactions, preferences, deleteTransaction } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

    // Filtered and sorted transactions
    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesType = filterType === 'all' || t.type === filterType;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, searchTerm, filterType]);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center space-x-2 shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="input"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>

            {/* Transactions List */}
            <div className="card animate-fade-in delay-100">
                {filteredTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction) => {
                                    return (
                                        <tr
                                            key={transaction.id}
                                            className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {transaction.description}
                                                </p>
                                                {transaction.notes && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {transaction.notes}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-danger'
                                                    }`}>
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className={`py-4 px-4 text-right font-bold ${transaction.type === 'income'
                                                ? 'text-success-600 dark:text-success-400'
                                                : 'text-danger-600 dark:text-danger-400'
                                                }`}>
                                                {transaction.type === 'income' ? '+' : '-'}
                                                {formatCurrency(transaction.amount, preferences.currency)}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleDelete(transaction.id)}
                                                        className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors text-danger-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">No transactions found</p>
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
