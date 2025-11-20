import { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/helpers';
import { Plus, Check, Trash2, User, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { ConfirmModal } from '../components/ConfirmModal';

interface LoanFormData {
    personName: string;
    amount: number;
    date: string;
    description?: string;
}

export const ToTake = () => {
    const { loans, addLoan, markLoanAsPaid, deleteLoan, preferences } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [markPaidConfirm, setMarkPaidConfirm] = useState<{
        isOpen: boolean;
        loan: { id: string; personName: string; amount: number } | null;
    }>({
        isOpen: false,
        loan: null,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<LoanFormData>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
        }
    });

    const onSubmit = (data: LoanFormData) => {
        addLoan({
            personName: data.personName,
            amount: Number(data.amount),
            date: data.date,
            description: data.description
        });
        reset();
        setIsFormOpen(false);
    };

    const handleMarkAsPaid = (loan: { id: string; personName: string; amount: number }) => {
        setMarkPaidConfirm({ isOpen: true, loan });
    };

    const confirmMarkAsPaid = () => {
        if (markPaidConfirm.loan) {
            markLoanAsPaid(markPaidConfirm.loan.id);
        }
        setMarkPaidConfirm({ isOpen: false, loan: null });
    };

    const cancelMarkAsPaid = () => {
        setMarkPaidConfirm({ isOpen: false, loan: null });
    };

    const pendingLoans = loans.filter(l => l.status === 'pending');
    const paidLoans = loans.filter(l => l.status === 'paid');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">To Take</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track money lent to friends and family
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="btn btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Loan</span>
                </button>
            </div>

            {/* Add Loan Form */}
            {isFormOpen && (
                <div className="card animate-scale-in">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Loan</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Person Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        {...register('personName', { required: 'Name is required' })}
                                        className="input pl-10"
                                    />
                                </div>
                                {errors.personName && (
                                    <p className="text-sm text-danger-500 mt-1">{errors.personName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('amount', { required: 'Amount is required', min: 0.01 })}
                                        className="input pl-10"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="text-sm text-danger-500 mt-1">{errors.amount.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Date Lent</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        {...register('date', { required: 'Date is required' })}
                                        className="input pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Description (Optional)</label>
                                <input
                                    type="text"
                                    {...register('description')}
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Loan
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pending Loans */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending</h2>
                {pendingLoans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up delay-100">
                        {pendingLoans.map((loan) => (
                            <div key={loan.id} className="card hover:shadow-lg transition-shadow border-l-4 border-l-warning-500">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{loan.personName}</h3>
                                        <p className="text-sm text-gray-500">{format(new Date(loan.date), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {formatCurrency(loan.amount, preferences.currency)}
                                    </span>
                                </div>
                                {loan.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 bg-gray-50 dark:bg-slate-700/50 p-2 rounded">
                                        {loan.description}
                                    </p>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
                                    <button
                                        onClick={() => deleteLoan(loan.id)}
                                        className="text-danger-500 hover:text-danger-600 p-2 rounded-full hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleMarkAsPaid({
                                            id: loan.id,
                                            personName: loan.personName,
                                            amount: loan.amount
                                        })}
                                        className="btn btn-primary py-1 px-3 text-sm flex items-center space-x-1"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Mark Received</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                        No pending loans. Everyone has paid you back! 🎉
                    </div>
                )}
            </div>

            {/* History (Paid Loans) */}
            {paidLoans.length > 0 && (
                <div className="space-y-4 pt-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white opacity-75">History</h2>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Person</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {paidLoans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {loan.personName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {format(new Date(loan.date), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-success-600 dark:text-success-400">
                                            {formatCurrency(loan.amount, preferences.currency)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400">
                                                Received
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => deleteLoan(loan.id)}
                                                className="text-gray-400 hover:text-danger-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={markPaidConfirm.isOpen}
                title="Mark as Received"
                message={markPaidConfirm.loan
                    ? `Mark ${formatCurrency(markPaidConfirm.loan.amount, preferences.currency)} from ${markPaidConfirm.loan.personName} as received? This will add it to your income.`
                    : ''
                }
                confirmText="Mark Received"
                cancelText="Cancel"
                onConfirm={confirmMarkAsPaid}
                onCancel={cancelMarkAsPaid}
            />
        </div>
    );
};
