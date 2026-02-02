import { api } from "../../shared/api/axios";

export type MonthlyStat = {
  month: number;
  amount: number;
}

export type WeekdayStat = {
  weekday: number;
  amount: number;
}


export type DashboardResponse = {
  joinedYear: number;
  monthlyStats: MonthlyStat[];
  weekdayStats: any[];
  hourlyStats: any[];
  target: any;
  feedback: any;
};


export const getDashboardApi = async (): Promise<DashboardResponse> => {
  const res = await api.get("/api/dashboard");
  return res.data.data;
};
