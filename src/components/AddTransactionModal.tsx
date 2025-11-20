import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store';
import { format } from 'date-fns';

interface TransactionFormData {
    type: 'income' | 'expense';
    amount: string;
    description: string;
    date: string;
    notes?: string;
}

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddTransactionModal = ({ isOpen, onClose }: AddTransactionModalProps) => {
    const { addTransaction } = useStore();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<TransactionFormData>({
        defaultValues: {
            type: 'expense',
            date: format(new Date(), 'yyyy-MM-dd'),
        },
    });

    const selectedType = watch('type');

    const onSubmit = (data: TransactionFormData) => {
        addTransaction({
            type: data.type,
            amount: parseFloat(data.amount),
            category: '', // Empty category
            description: data.description,
            date: data.date,
            notes: data.notes,
        });
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add Transaction
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Type Selection */}
                    <div>
                        <label className="label">Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="relative">
                                <input
                                    type="radio"
                                    value="income"
                                    {...register('type')}
                                    className="peer sr-only"
                                />
                                <div className="card cursor-pointer border-2 border-transparent peer-checked:border-success-500 peer-checked:bg-success-50 dark:peer-checked:bg-success-900/20 transition-all">
                                    <p className="text-center font-medium">Income</p>
                                </div>
                            </label>
                            <label className="relative">
                                <input
                                    type="radio"
                                    value="expense"
                                    {...register('type')}
                                    className="peer sr-only"
                                />
                                <div className="card cursor-pointer border-2 border-transparent peer-checked:border-danger-500 peer-checked:bg-danger-50 dark:peer-checked:bg-danger-900/20 transition-all">
                                    <p className="text-center font-medium">Expense</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="label">Amount *</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('amount', { required: 'Amount is required', min: 0.01 })}
                            className={`input ${errors.amount ? 'input-error' : ''}`}
                        />
                        {errors.amount && (
                            <p className="text-sm text-danger-600 mt-1">{errors.amount.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">Description *</label>
                        <input
                            type="text"
                            {...register('description', { required: 'Description is required' })}
                            className={`input ${errors.description ? 'input-error' : ''}`}
                        />
                        {errors.description && (
                            <p className="text-sm text-danger-600 mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="label">Date *</label>
                        <input
                            type="date"
                            {...register('date', { required: 'Date is required' })}
                            className={`input ${errors.date ? 'input-error' : ''}`}
                        />
                        {errors.date && (
                            <p className="text-sm text-danger-600 mt-1">{errors.date.message}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="label">Notes (Optional)</label>
                        <textarea
                            {...register('notes')}
                            className="input"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`btn flex-1 ${selectedType === 'income' ? 'btn-success' : 'btn-danger'
                                }`}
                        >
                            Add {selectedType === 'income' ? 'Income' : 'Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
