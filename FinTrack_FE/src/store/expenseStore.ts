import {create} from "zustand";

export type Expense = {
    id: number;
    amount: number;
    category: string;
};


type ExpenseStore=  {
    expenses: Expense[];
    addExpense: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
};

export const useExpenseStore = create<ExpenseStore>((set) => ({
    expenses: [],
    addExpense: (expense) =>
        set((state) => ({
            expenses: [expense, ...state.expenses],
        })),

    deleteExpense: (id) =>
        set((state) => ({
            expenses: state.expenses.filter((e) => e.id !== id),
        })),
}));