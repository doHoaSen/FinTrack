import type { ExpenseCreatePayload, Expense } from "../../store/expenseStore";
import { api } from "../../shared/api/axios";

const API_BASE = "/api/expenses";

/** 지출 생성 */
export const createExpenseApi = async (payload: ExpenseCreatePayload) => {
  const res = await api.post(API_BASE, payload);
  return res.data.data; // 생성된 expenseId
};

/** 지출 수정 */
export const updateExpenseApi = async (
  expenseId: number,
  payload: Partial<ExpenseCreatePayload>
) : Promise<Expense> => {
  const res = await api.patch(`${API_BASE}/${expenseId}`, payload);
  return res.data.data;
};


/** 지출 삭제 */
export const deleteExpenseApi = (expenseId: number) =>
  api.delete(`${API_BASE}/${expenseId}`);



/** 최근 지출 조회 */
export const getRecentExpensesApi = async (): Promise<Expense[]> => {
  const res = await api.get(`${API_BASE}/recent`);
  return res.data.data;
};

/** 지출 조회 */
export const getExpenseApi = async (params: {
  year: number;
  month: number;
  page?: number;
  size?: number;
  categoryId?: number;
  type?: "FIXED" | "VARIABLE";
}) => {
  const res = await api.get("/api/expenses", {params});

  return res.data.data;
}


