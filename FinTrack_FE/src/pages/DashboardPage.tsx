import SummarySection from "../components/dashboard/SummarySection";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import GoalHistoryPreview from "../components/dashboard/GoalHistoryPreview";
import RecentExpenseSection from "../components/dashboard/RecentExpenseSection";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardApi } from "../features/dashboard/api";
import type { MonthlyStat } from "../features/dashboard/api";
import { Grid, Box, Typography } from "@mui/material";
import { getRecentExpensesApi } from "../features/expense/api";
import type { Expense } from "../store/expenseStore";
import { useExpenseStore } from "../store/expenseStore";
import { useDashboardStore } from "../store/dashboardStore";
import MonthlyExpenseChart from "../components/dashboard/MonthlyExpenseChart";
import getRecentRange from "../components/dashboard/util/getRecentRange";
import StatsTabsCard from "../components/dashboard/StatsTabsCard";
import type { WeekdayStat } from "../features/dashboard/api";

function DashboardPage() {
  const navigate = useNavigate();
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [error, setError] = useState("");
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  const [monthlyTotal, setMonthlyTotal] = useState(0);


  const fetchDashboard = useDashboardStore((s) => s.fetchDashboard);
  const fetchRecent = async () => {
    const all = await getRecentExpensesApi();

    const { startDate, endDate } = getRecentRange();

    const filtered = all.filter((expense) => {
      if (!expense.expenseAt) return false; // null 방어

      const expenseDate = new Date(expense.expenseAt);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    setRecentExpenses(filtered);
  };

  const handleDelete = async (id: number) => {
    const target = recentExpenses.find(e => e.id === id);

    // optimistic update
    setRecentExpenses(prev => prev.filter(e => e.id !== id));

    if (target?.expenseAt) {
      const expenseDate = new Date(target.expenseAt);
      const now = new Date();

      const isThisMonth =
        expenseDate.getFullYear() === now.getFullYear() &&
        expenseDate.getMonth() === now.getMonth();

      if (isThisMonth) {
        setMonthlyTotal(prev => prev - target.amount);
      }
    }

    // 서버 삭제
    await deleteExpense(id);

    // 서버 재동기화
    fetchDashboardData();
    fetchRecent();
  };


  // 월별지출 시각화
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  // 요일 시각화
  const [weekdayStats, setWeekdayStats] = useState<WeekdayStat[]>([]);


  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardApi();

      const currentMonth = new Date().getMonth() + 1;
      const currentMonthStat = data.monthlyStats.find(
        (stat) => stat.month === currentMonth
      );

      setMonthlyTotal(currentMonthStat?.amount ?? 0);
      setWeekdayStats(data.weekdayStats);
    } catch {
      setError("대시보드 데이터를 불러오지 못했습니다.");
    }
  };



  useEffect(() => {
    fetchDashboardData();
    fetchRecent();
  }, []);




  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        FINTRACK DASHBOARD
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      {/* A + B */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SummarySection monthlyTotal={monthlyTotal} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <QuickExpenseForm
            onSuccess={async (createdExpense?: Expense) => {
              // 1️⃣ optimistic update
              if (createdExpense) {
                // 최근 지출 즉시 반영
                setRecentExpenses((prev) => [
                  createdExpense,
                  ...prev,
                ]);

                // 이번 달 총 소비 즉시 누적
                if (createdExpense.expenseAt) {
                  const expenseDate = new Date(createdExpense.expenseAt);
                  const now = new Date();

                  const isThisMonth =
                    expenseDate.getFullYear() === now.getFullYear() &&
                    expenseDate.getMonth() === now.getMonth();

                  if (isThisMonth) {
                    setMonthlyTotal((prev) => prev + createdExpense.amount);
                  }
                }
              }

              // 2️⃣ 백그라운드 서버 재동기화 (정합성 보장)
              await fetchDashboardData();
              await fetchRecent();
            }}
          />
        </Grid>
      </Grid>

      {/* C: 월별 소비 시각화 */}
      <Box mt={3} mb={3}>
        <StatsTabsCard weekdayStats={weekdayStats} />
      </Box>


      {/* D */}
      <Box mb={3}>
        <RecentExpenseSection
          expenses={recentExpenses}
          onDeleteExpense={handleDelete}
          onEditExpense={(expense) => setEditingExpense(expense)}
          onMore={() => navigate("/expenses")}
        />

        {/* 수정 모달 */}
        {editingExpense && (
          <QuickExpenseForm
            mode="edit"
            initialExpense={editingExpense}
            onClose={() => setEditingExpense(null)}
            onSuccess={(updated: Expense) => {
              // 최근 지출 리스트 즉시 반영
              setRecentExpenses(prev =>
                prev.map(e => (e.id === updated.id ? updated : e))
              );

              // 이번 달 총 소비 보정
              const now = new Date();

              const oldExpense = recentExpenses.find(e => e.id === updated.id);

              const isOldThisMonth =
                oldExpense?.expenseAt &&
                new Date(oldExpense.expenseAt).getMonth() === now.getMonth();

              const isNewThisMonth =
                updated.expenseAt &&
                new Date(updated.expenseAt).getMonth() === now.getMonth();

              if (isOldThisMonth && isNewThisMonth) {
                // 같은 달에서 금액만 변경
                setMonthlyTotal(prev =>
                  prev + updated.amount - (oldExpense?.amount ?? 0)
                );
              } else if (!isOldThisMonth && isNewThisMonth) {
                // 다른 달 → 이번 달로 이동
                setMonthlyTotal(prev => prev + updated.amount);
              } else if (isOldThisMonth && !isNewThisMonth) {
                // 이번 달 → 다른 달로 이동
                setMonthlyTotal(prev => prev - (oldExpense?.amount ?? 0));
              }

              setEditingExpense(null);

              // 서버 재동기화 (그래프 포함)
              fetchDashboardData();
              fetchRecent();
            }}

          />
        )}
      </Box>

      {/* E (임시: 목표 히스토리) */}
      <GoalHistoryPreview />
    </Box>
  );
}

export default DashboardPage;
