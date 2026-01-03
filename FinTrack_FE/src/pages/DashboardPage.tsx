import SummarySection from "../components/dashboard/SummarySection";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import GoalHistoryPreview from "../components/dashboard/GoalHistoryPreview";
import RecentExpenseSection from "../components/dashboard/RecentExpenseSection";
import { useEffect, useState } from "react";
import { getDashboardApi } from "../features/dashboard/api";

function DashboardPage() {
  const [total, setTotal] = useState<number>(0);
  const [recent, setRecent] = useState<
    { id: number; category: string; amount: number }[]
  >([]);
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
    <div style={{ padding: 24 }}>
      <h1>FINTRACK DASHBOARD</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <SummarySection total={total} />

  
      <QuickExpenseForm />

      <GoalHistoryPreview />

      <RecentExpenseSection
        expenses={recent}
        onDeleteExpense={() => {}}
      />
    </div>
  );
}

export default DashboardPage;
