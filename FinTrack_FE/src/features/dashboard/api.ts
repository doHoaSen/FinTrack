import { api } from "../../shared/api/axios";

export type DashboardResponse = {
  totalExpense: number;
  recentExpenses: {
    id: number;
    category: string;
    amount: number;
  }[];
};

export const getDashboardApi = async (): Promise<DashboardResponse> => {
  const res = await api.get("/api/dashboard");
  return res.data;
};
