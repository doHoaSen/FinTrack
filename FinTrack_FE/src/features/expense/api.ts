import type { ExpenseCreatePayload } from "../../store/expenseStore";
import { api } from "../../shared/api/axios";
import type { Expense } from "../../store/expenseStore";

const API_BASE = "/api/expenses";

/** 지출 생성 */
export const createExpenseApi = (payload: ExpenseCreatePayload) =>
  api.post(API_BASE, payload);

/** 지출 삭제 */
export const deleteExpenseApi = (expenseId: number) =>
  api.delete(`${API_BASE}/${expenseId}`);



/** 최근 지출 조회 */
export const getRecentExpensesApi = async (): Promise<Expense[]> => {
  const res = await api.get("/api/expenses/recent");
  return res.data.data;
};

export type ExpenseUpdatePayload = {
  amount?: number;
  categoryId?: number;
  memo?: string;
  expenseAt?: string;
}

/** 지출 수정 */
export const updateExpenseApi = (
  expenseId: number,
  payload: ExpenseUpdatePayload
) => {
  return api.patch(`api/expenses/${expenseId}`, payload);
};
