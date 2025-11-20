import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, UserPreferences, Loan } from '../types';
import { supabase } from '../lib/supabase';

interface StoreState {
    transactions: Transaction[];
    loans: Loan[];
    preferences: UserPreferences;
    user: any | null;
    setUser: (user: any | null) => void;
    fetchData: () => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    addLoan: (loan: Omit<Loan, 'id' | 'status'>) => Promise<void>;
    markLoanAsPaid: (id: string) => Promise<void>;
    deleteLoan: (id: string) => Promise<void>;
    updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            transactions: [],
            loans: [],
            preferences: {
                currency: 'INR',
                theme: 'system',
            },
            user: null,
            setUser: (user) => set({ user }),

            fetchData: async () => {
                const { user } = get();
                if (!user) return;

                const [transactionsRes, loansRes, profilesRes] = await Promise.all([
                    supabase.from('transactions').select('*').eq('user_id', user.id),
                    supabase.from('loans').select('*').eq('user_id', user.id),
                    supabase.from('profiles').select('*').eq('id', user.id).single(),
                ]);

                if (transactionsRes.data) set({ transactions: transactionsRes.data });
                if (loansRes.data) set({ loans: loansRes.data });
                if (profilesRes.data) set({ preferences: { ...get().preferences, ...profilesRes.data } });
            },

            addTransaction: async (transaction) => {
                const newTransaction = { ...transaction, id: crypto.randomUUID() };
                const { user } = get();

                // Optimistic update
                set((state) => ({
                    transactions: [...state.transactions, newTransaction],
                }));

                if (user) {
                    await supabase.from('transactions').insert({
                        ...newTransaction,
                        user_id: user.id,
                    });
                }
            },

            deleteTransaction: async (id) => {
                const { user } = get();
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));

                if (user) {
                    await supabase.from('transactions').delete().eq('id', id);
                }
            },

            addLoan: async (loan) => {
                const newLoan = { ...loan, id: crypto.randomUUID(), status: 'pending' as const };
                const { user } = get();

                set((state) => ({
                    loans: [...state.loans, newLoan],
                }));

                if (user) {
                    await supabase.from('loans').insert({
                        ...newLoan,
                        user_id: user.id,
                        person_name: newLoan.personName, // Map camelCase to snake_case
                    });
                }
            },

            markLoanAsPaid: async (id) => {
                const { user } = get();
                const state = get();
                const loan = state.loans.find((l) => l.id === id);
                if (!loan || loan.status === 'paid') return;

                // Automatically add income transaction
                const newTransaction: Transaction = {
                    id: crypto.randomUUID(),
                    type: 'income',
                    amount: loan.amount,
                    category: 'Loan Repayment',
                    description: `Repayment from ${loan.personName}`,
                    date: new Date().toISOString(),
                };

                set((state) => ({
                    loans: state.loans.map((l) =>
                        l.id === id ? { ...l, status: 'paid' } : l
                    ),
                    transactions: [...state.transactions, newTransaction],
                }));

                if (user) {
                    await Promise.all([
                        supabase.from('loans').update({ status: 'paid' }).eq('id', id),
                        supabase.from('transactions').insert({
                            ...newTransaction,
                            user_id: user.id,
                        }),
                    ]);
                }
            },

            deleteLoan: async (id) => {
                const { user } = get();
                set((state) => ({
                    loans: state.loans.filter((l) => l.id !== id),
                }));

                if (user) {
                    await supabase.from('loans').delete().eq('id', id);
                }
            },

            updatePreferences: async (preferences) => {
                const { user } = get();
                set((state) => ({
                    preferences: { ...state.preferences, ...preferences },
                }));

                if (user) {
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        ...preferences,
                        updated_at: new Date().toISOString(),
                    });
                }
            },
        }),
        {
            name: 'daily-dime-storage',
        }
    )
);
