import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

export const formatDate = (date: string | Date): string => {
    return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateShort = (date: string | Date): string => {
    return format(new Date(date), 'MMM dd');
};

export const getCurrentMonth = () => {
    const now = new Date();
    return {
        start: startOfMonth(now),
        end: endOfMonth(now),
    };
};

export const getCurrentWeek = () => {
    const now = new Date();
    return {
        start: startOfWeek(now),
        end: endOfWeek(now),
    };
};

export const isDateInRange = (date: string | Date, start: Date, end: Date): boolean => {
    return isWithinInterval(new Date(date), { start, end });
};

export const generateId = (): string => {
    return crypto.randomUUID();
};

export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};
