import { api } from "../../shared/api/axios";

export type MonthlyStat = {
  month: number;
  amount: number;
};

export type WeekdayStat = {
  weekday: number;
  amount: number;
};

export type HourlyStat = {
  hour: number;
  amount: number;
};

export type CategoryStat = {
  name: string;
  amount: number;
};

export type TargetResponse = {
  targetAmount: number | null;
  usedAmount: number;
  ratio: number;
  year: number | null;
  month: number | null;
  message: string;
  exists: boolean;
};

export type MonthlyTrend = {
  status: string;
  currentMonth: number;
  lastMonth: number;
  percentDiff: number;
  message: string;
};

export type WeekdayPattern = {
  peakDay: number;
  peakAmount: number;
  message: string;
};

export type HourlyPattern = {
  peakHour: number;
  amount: number;
  message: string;
};

export type CategoryPattern = {
  topCategory: string;
  amount: number;
  ratio: number;
  message: string;
};

export type TargetProgress = {
  targetAmount: number;
  usedAmount: number;
  ratio: number;
  achieved: boolean;
  message: string;
};

export type FixedVsVariable = {
  fixedTotal: number;
  variableTotal: number;
  fixedRatio: number;
  variableRatio: number;
  message: string;
};

export type CategoryConcentration = {
  topCategory: string;
  amount: number;
  ratio: number;
  message: string;
};

export type DailyAverageTrend = {
  currentAvg: number;
  lastMonthAvg: number;
  diff: number;
  message: string;
};

export type SpikeDetection = {
  date: string;
  amount: number;
  message: string;
};

export type OverSpendSequence = {
  streak: number;
  message: string;
};

export type WeekCompare = {
  thisWeek: number;
  lastWeek: number;
  diffPercent: number;
  message: string;
};

export type WeeklyAverageTrend = {
  thisWeekAvg: number;
  lastWeekAvg: number;
  diffPercent: number;
  message: string;
};

export type CategoryMonthlyCompare = {
  categoryName: string;
  thisMonth: number;
  lastMonth: number;
  changeRate: number;
  message: string;
};

export type FeedbackResponse = {
  monthlyTrend: MonthlyTrend | null;
  weekdayPattern: WeekdayPattern | null;
  hourlyPattern: HourlyPattern | null;
  categoryPattern: CategoryPattern | null;
  targetProgress: TargetProgress | null;
  fixedVsVariable: FixedVsVariable | null;
  categoryConcentration: CategoryConcentration | null;
  dailyAverageTrend: DailyAverageTrend | null;
  spikeDetection: SpikeDetection | null;
  overSpendSequence: OverSpendSequence | null;
  weekCompare: WeekCompare | null;
  weeklyAverageTrend: WeeklyAverageTrend | null;
  categoryMonthlyCompare: CategoryMonthlyCompare[] | null;
};

export type DashboardResponse = {
  joinedYear: number;
  monthlyStats: MonthlyStat[];
  weekdayStats: WeekdayStat[];
  hourlyStats: HourlyStat[];
  categoryTotals: Record<string, number>;
  target: TargetResponse | null;
  feedback: FeedbackResponse | null;
};

export const getDashboardApi = async (): Promise<DashboardResponse> => {
  const res = await api.get("/api/dashboard");
  return res.data.data;
};
