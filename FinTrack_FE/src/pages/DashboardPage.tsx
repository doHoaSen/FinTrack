import SummarySection from "../components/dashboard/SummarySection";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import GoalHistoryPreview from "../components/dashboard/GoalHistoryPreview";
import RecentExpenseSection from "../components/dashboard/RecentExpenseSection";

import { useEffect, useState } from "react";
import { getDashboardApi } from "../features/dashboard/api";
import { Grid, Box, Typography } from "@mui/material";

type RecentExpense = {
  id: number;
  category: string;
  amount: number;
};

function DashboardPage() {
  const [total, setTotal] = useState(0);
  const [recent, setRecent] = useState<RecentExpense[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardApi()
      .then((res) => {
        setTotal(res.totalExpense ?? 0);
        setRecent(res.recentExpenses ?? []);
      })
      .catch((e) => {
        setError("대시보드 데이터를 불러오지 못했습니다.");
        if (e.response?.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      });
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
          expenses={recent}
          onDeleteExpense={() => { }}
        />
      </Box>

      {/* E (임시: 목표 히스토리) */}
      <GoalHistoryPreview />
    </Box>
  );
}

export default DashboardPage;
