import type { ExpenseCreatePayload } from "../../store/expenseStore";
import { api } from "../../shared/api/axios";


const API_BASE = "/api/expenses";

/** 지출 생성 */
export const createExpenseApi = (payload: ExpenseCreatePayload) =>
  api.post(API_BASE, payload);

/** 지출 삭제 */
export const deleteExpenseApi = (expenseId: number) =>
  api.delete(`${API_BASE}/${expenseId}`);