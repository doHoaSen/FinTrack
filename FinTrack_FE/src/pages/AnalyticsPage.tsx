import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import BoltIcon from "@mui/icons-material/Bolt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);
import { getDashboardApi } from "../features/dashboard/api";
import type {
  FeedbackResponse,
  MonthlyStat,
  WeekdayStat,
  CategoryMonthlyCompare,
} from "../features/dashboard/api";
import type { HourlyStat } from "../components/dashboard/util/normalizeHourlyStats";
import type { CategoryStat } from "../components/dashboard/CategoryExpenseChart";
import WeekdayExpenseChart from "../components/dashboard/WeekdayExpenseChart";
import HourlyExpenseChart from "../components/dashboard/HourlyExpenseChart";
import MonthlyExpenseChart from "../components/dashboard/MonthlyExpenseChart";
import CategoryExpenseChart from "../components/dashboard/CategoryExpenseChart";

// ────────────────────────────────────────────────────────────────────────
// 상단 요약 stat 카드
// ────────────────────────────────────────────────────────────────────────
type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "flat";
  color?: string;
};

function StatCard({ label, value, sub, trend, color = "text.primary" }: StatCardProps) {
  const icon =
    trend === "up" ? <TrendingUpIcon fontSize="small" /> :
    trend === "down" ? <TrendingDownIcon fontSize="small" /> :
    trend === "flat" ? <TrendingFlatIcon fontSize="small" /> : null;

  const iconColor =
    trend === "up" ? "error.main" :
    trend === "down" ? "success.main" : "text.disabled";

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} mt={0.75} mb={0.5}>
          <Typography variant="h5" fontWeight={700} color={color} lineHeight={1}>
            {value}
          </Typography>
          {icon && (
            <Box sx={{ color: iconColor, display: "flex", alignItems: "center" }}>
              {icon}
            </Box>
          )}
        </Box>
        {sub && (
          <Typography variant="caption" color="text.disabled">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 카테고리 전월 비교 행
// ────────────────────────────────────────────────────────────────────────
function CategoryCompareRow({ item }: { item: CategoryMonthlyCompare }) {
  const isIncrease = item.changeRate > 0;
  const max = Math.max(item.thisMonth, item.lastMonth, 1);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" fontWeight={600}>{item.categoryName}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.disabled">
            전월 ₩{item.lastMonth.toLocaleString()}
          </Typography>
          <Chip
            label={`${isIncrease ? "+" : ""}${(item.changeRate ?? 0).toFixed(1)}%`}
            color={isIncrease ? "error" : "success"}
            size="small"
            sx={{ fontSize: 11, height: 20 }}
          />
          <Typography variant="body2" fontWeight={700}>
            ₩{item.thisMonth.toLocaleString()}
          </Typography>
        </Box>
      </Box>
      {/* 이번 달 바 */}
      <LinearProgress
        variant="determinate"
        value={(item.thisMonth / max) * 100}
        sx={{ height: 5, borderRadius: 3, mb: 0.5, bgcolor: "action.hover" }}
        color={isIncrease ? "error" : "primary"}
      />
      {/* 전월 바 */}
      <LinearProgress
        variant="determinate"
        value={(item.lastMonth / max) * 100}
        sx={{
          height: 3,
          borderRadius: 3,
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": { bgcolor: "text.disabled" },
        }}
      />
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────
// 메인 페이지
// ────────────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [weekdayStats, setWeekdayStats] = useState<WeekdayStat[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardApi()
      .then((data) => {
        setFeedback(data.feedback);
        setWeekdayStats(data.weekdayStats);
        setHourlyStats(data.hourlyStats);
        setMonthlyStats(data.monthlyStats);

        const currentMonth = new Date().getMonth() + 1;
        const currentStat = data.monthlyStats.find((s) => s.month === currentMonth);
        setMonthlyTotal(currentStat?.amount ?? 0);

        if (data.categoryTotals) {
          setCategoryStats(
            Object.entries(data.categoryTotals)
              .map(([name, amount]) => ({ name, amount: Number(amount) }))
              .sort((a, b) => b.amount - a.amount)
          );
        }
      })
      .catch(() => setError("데이터를 불러오지 못했습니다."));
  }, []);

  const fb = feedback;

  // 고정비 vs 변동비 파이 데이터
  const fixedVarData =
    fb?.fixedVsVariable
      ? [
          { name: "고정비", value: fb.fixedVsVariable.fixedTotal },
          { name: "변동비", value: fb.fixedVsVariable.variableTotal },
        ]
      : [];

  // 상단 stat 카드 데이터
  const monthlyTrendCard = fb?.monthlyTrend
    ? {
        label: "전월 대비",
        value: `${fb.monthlyTrend.percentDiff > 0 ? "+" : ""}${(fb.monthlyTrend.percentDiff ?? 0).toFixed(1)}%`,
        sub: `이번 달 ₩${(fb.monthlyTrend.currentMonth ?? 0).toLocaleString()} / 전월 ₩${(fb.monthlyTrend.lastMonth ?? 0).toLocaleString()}`,
        trend: (fb.monthlyTrend.status === "increase" ? "up" : fb.monthlyTrend.status === "decrease" ? "down" : "flat") as "up" | "down" | "flat",
        color: fb.monthlyTrend.status === "increase" ? "error.main" : fb.monthlyTrend.status === "decrease" ? "success.main" : "text.primary",
      }
    : null;

  const weekCompareCard = fb?.weekCompare
    ? {
        label: "전주 대비",
        value: `${fb.weekCompare.diffPercent > 0 ? "+" : ""}${(fb.weekCompare.diffPercent ?? 0).toFixed(1)}%`,
        sub: `이번 주 ₩${(fb.weekCompare.thisWeek ?? 0).toLocaleString()} / 전주 ₩${(fb.weekCompare.lastWeek ?? 0).toLocaleString()}`,
        trend: (fb.weekCompare.diffPercent > 0 ? "up" : fb.weekCompare.diffPercent < 0 ? "down" : "flat") as "up" | "down" | "flat",
        color: fb.weekCompare.diffPercent > 0 ? "error.main" : "success.main",
      }
    : null;

  const dailyAvgCard = fb?.dailyAverageTrend
    ? {
        label: "일 평균 소비",
        value: `₩${(fb.dailyAverageTrend.currentAvg ?? 0).toLocaleString()}`,
        sub: `전월 일 평균 ₩${(fb.dailyAverageTrend.lastMonthAvg ?? 0).toLocaleString()}`,
        trend: ((fb.dailyAverageTrend.diff ?? 0) > 0 ? "up" : (fb.dailyAverageTrend.diff ?? 0) < 0 ? "down" : "flat") as "up" | "down" | "flat",
      }
    : null;

  const targetCard = fb?.targetProgress
    ? {
        label: "목표 달성률",
        value: `${(fb.targetProgress.ratio ?? 0).toFixed(1)}%`,
        sub: fb.targetProgress.achieved ? "이번 달 목표 달성!" : `₩${(fb.targetProgress.usedAmount ?? 0).toLocaleString()} / ₩${(fb.targetProgress.targetAmount ?? 0).toLocaleString()}`,
        color: fb.targetProgress.achieved ? "success.main" : fb.targetProgress.ratio > 100 ? "error.main" : "primary.main",
      }
    : null;

  const statCards = [monthlyTrendCard, weekCompareCard, dailyAvgCard, targetCard].filter(Boolean) as StatCardProps[];

  const hasSpike = !!fb?.spikeDetection?.message;
  const hasOverSpend = !!fb?.overSpendSequence?.message && (fb.overSpendSequence.streak ?? 0) > 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        ANALYTICS
      </Typography>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      {/* ── 위험 신호 (있을 때만) ── */}
      {(hasSpike || hasOverSpend) && (
        <Box mb={3} display="flex" flexDirection="column" gap={1}>
          {hasSpike && (
            <Alert
              severity="error"
              icon={<BoltIcon fontSize="small" />}
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight={600} component="span">지출 급증 탐지&nbsp;</Typography>
              {fb!.spikeDetection!.message}
            </Alert>
          )}
          {hasOverSpend && (
            <Alert
              severity="warning"
              icon={<WarningAmberIcon fontSize="small" />}
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight={600} component="span">
                {fb!.overSpendSequence!.streak}일 연속 증가&nbsp;
              </Typography>
              {fb!.overSpendSequence!.message}
            </Alert>
          )}
        </Box>
      )}

      {/* ── 상단 stat 카드 ── */}
      {statCards.length > 0 && (
        <Grid container spacing={2} mb={3}>
          {statCards.map((card, i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── 고정비 vs 변동비 + 카테고리 도넛 ── */}
      <Grid container spacing={2} mb={3}>
        {fb?.fixedVsVariable && (
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={0.5}>
                  고정비 vs 변동비
                </Typography>
                <Typography variant="caption" color="text.disabled" display="block" mb={2}>
                  {fb.fixedVsVariable.message}
                </Typography>
                <Box sx={{ width: "100%", height: 220 }}>
                  <Doughnut
                    data={{
                      labels: fixedVarData.map((d) => d.name),
                      datasets: [{
                        data: fixedVarData.map((d) => d.value),
                        backgroundColor: ["rgba(25,118,210,0.85)", "rgba(237,108,2,0.85)"],
                        hoverBackgroundColor: ["#1976d2", "#ed6c02"],
                        borderWidth: 0,
                        hoverOffset: 6,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: { duration: 700, easing: "easeOutQuart" },
                      cutout: "65%",
                      plugins: {
                        legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } },
                        tooltip: {
                          callbacks: { label: (ctx) => ` ₩${ctx.parsed.toLocaleString()}` },
                          backgroundColor: "rgba(255,255,255,0.95)",
                          titleColor: "#333",
                          bodyColor: "#555",
                          borderColor: "#e0e0e0",
                          borderWidth: 1,
                          padding: 10,
                          cornerRadius: 8,
                        },
                      },
                    }}
                  />
                </Box>
                <Box display="flex" justifyContent="space-around" textAlign="center" mt={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">고정비</Typography>
                    <Typography variant="body1" fontWeight={700} color="primary.main">
                      {(fb.fixedVsVariable.fixedRatio ?? 0).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">변동비</Typography>
                    <Typography variant="body1" fontWeight={700} color="warning.main">
                      {(fb.fixedVsVariable.variableRatio ?? 0).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12, md: fb?.fixedVsVariable ? 7 : 12 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
                카테고리별 지출
              </Typography>
              <CategoryExpenseChart data={categoryStats} total={monthlyTotal} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── 요일별 + 시간대별 패턴 ── */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={0.5}>
                요일별 소비 패턴
              </Typography>
              {fb?.weekdayPattern && (
                <Typography variant="caption" color="text.disabled" display="block" mb={1}>
                  {fb.weekdayPattern.message}
                </Typography>
              )}
              <WeekdayExpenseChart data={weekdayStats} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={0.5}>
                시간대별 소비 패턴
              </Typography>
              {fb?.hourlyPattern && (
                <Typography variant="caption" color="text.disabled" display="block" mb={1}>
                  {fb.hourlyPattern.message}
                </Typography>
              )}
              <HourlyExpenseChart data={hourlyStats} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── 카테고리 전월 비교 ── */}
      {fb?.categoryMonthlyCompare && fb.categoryMonthlyCompare.length > 0 && (
        <Box mb={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2.5}>
                카테고리 전월 비교
              </Typography>
              <Box display="flex" flexDirection="column" gap={2.5}>
                {fb.categoryMonthlyCompare.map((item) => (
                  <CategoryCompareRow key={item.categoryName} item={item} />
                ))}
              </Box>
              <Box display="flex" gap={2} mt={2}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ width: 12, height: 5, borderRadius: 1, bgcolor: "primary.main" }} />
                  <Typography variant="caption" color="text.secondary">이번 달</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ width: 12, height: 3, borderRadius: 1, bgcolor: "text.disabled" }} />
                  <Typography variant="caption" color="text.secondary">전월</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* ── 월별 지출 추이 ── */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
            월별 지출 추이
          </Typography>
          <MonthlyExpenseChart data={monthlyStats} />
        </CardContent>
      </Card>
    </Box>
  );
}

export default AnalyticsPage;
