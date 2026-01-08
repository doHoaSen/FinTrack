import SummarySection from "../components/dashboard/SummarySection";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import GoalHistoryPreview from "../components/dashboard/GoalHistoryPreview";
import RecentExpenseSection from "../components/dashboard/RecentExpenseSection";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardApi } from "../features/dashboard/api";
import { Grid, Box, Typography } from "@mui/material";
import { getRecentExpensesApi } from "../features/expense/api";
import type { Expense } from "../store/expenseStore";
import { useExpenseStore } from "../store/expenseStore";

function DashboardPage() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [error, setError] = useState("");
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);


  const handleDelete = async (id: number) => {
    await deleteExpense(id);
    setRecentExpenses((prev) => prev.filter((e) => e.id !== id));
  };


  useEffect(() => {
    getDashboardApi()
      .then((res) => {
        setTotal(res.totalExpense ?? 0);
      })
      .catch((e) => {
        setError("대시보드 데이터를 불러오지 못했습니다.");
        if (e.response?.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      });

    getRecentExpensesApi()
      .then(setRecentExpenses)
      .catch(() => setRecentExpenses([]));
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
          <SummarySection />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <QuickExpenseForm />
        </Grid>
      </Grid>

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
            onSuccess={(updated) => {
              setRecentExpenses((prev) =>
                prev.map((e) => (e.id === updated.id ? updated : e))
              );
              setEditingExpense(null);
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
