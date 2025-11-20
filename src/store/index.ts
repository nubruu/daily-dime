import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, UserPreferences, Loan } from '../types';

interface StoreState {
    transactions: Transaction[];
    loans: Loan[];
    preferences: UserPreferences;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    addLoan: (loan: Omit<Loan, 'id' | 'status'>) => void;
    markLoanAsPaid: (id: string) => void;
    deleteLoan: (id: string) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            transactions: [],
            loans: [],
            preferences: {
                currency: 'INR',
                theme: 'light',
            },
            addTransaction: (transaction) =>
                set((state) => ({
                    transactions: [
                        ...state.transactions,
                        { ...transaction, id: crypto.randomUUID() },
                    ],
                })),
            deleteTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                })),
            addLoan: (loan) =>
                set((state) => ({
                    loans: [
                        ...state.loans,
                        { ...loan, id: crypto.randomUUID(), status: 'pending' },
                    ],
                })),
            markLoanAsPaid: (id) =>
                set((state) => {
                    const loan = state.loans.find((l) => l.id === id);
                    if (!loan || loan.status === 'paid') return state;

                    // Automatically add income transaction
                    const newTransaction: Transaction = {
                        id: crypto.randomUUID(),
                        type: 'income',
                        amount: loan.amount,
                        category: 'Loan Repayment',
                        description: `Repayment from ${loan.personName}`,
                        date: new Date().toISOString(),
                    };

                    return {
                        loans: state.loans.map((l) =>
                            l.id === id ? { ...l, status: 'paid' } : l
                        ),
                        transactions: [...state.transactions, newTransaction],
                    };
                }),
            deleteLoan: (id) =>
                set((state) => ({
                    loans: state.loans.filter((l) => l.id !== id),
                })),
            updatePreferences: (preferences) =>
                set((state) => ({
                    preferences: { ...state.preferences, ...preferences },
                })),
        }),
        {
            name: 'daily-dime-storage',
        }
    )
);
