// Transaction types
export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    notes?: string;
    tags?: string[];
}

// Loan type for "To Take" feature
export interface Loan {
    id: string;
    personName: string;
    amount: number;
    date: string;
    status: 'pending' | 'paid';
    description?: string;
}

// User preferences
export interface UserPreferences {
    currency: string;
    theme: 'light' | 'dark' | 'system';
}

// Summary data
export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    period: string;
}
