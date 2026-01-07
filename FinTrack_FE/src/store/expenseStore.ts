import {create} from "zustand";
import { createExpenseApi, deleteExpenseApi } from "../features/expense/api";

export type ExpenseCreatePayload = {
    amount: number;
    categoryId: number;
    memo?: string;
    expenseAt: string;
};


type ExpenseStore = {
  isLoading: boolean;
  addExpense: (payload: ExpenseCreatePayload) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
};

export const useExpenseStore = create<ExpenseStore>((set) => ({
  isLoading: false,

  // ✔ 공용 지출 생성 (빠른 등록 / 상세 등록 공통)
  addExpense: async (payload) => {
    set({ isLoading: true });
    try {
      await createExpenseApi(payload);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✔ 서버 삭제만 담당 (목록 관리는 페이지에서)
  deleteExpense: async (id) => {
    set({ isLoading: true });
    try {
      await deleteExpenseApi(id);
    } finally {
      set({ isLoading: false });
    }
  },
}));