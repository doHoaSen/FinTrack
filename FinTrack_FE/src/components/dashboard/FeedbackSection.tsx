import { Box, Card, CardContent, Typography, Grid, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import BoltIcon from "@mui/icons-material/Bolt";
import type { FeedbackResponse, CategoryMonthlyCompare } from "../../features/dashboard/api";

type Props = {
  feedback: FeedbackResponse | null;
};

type FeedbackCardProps = {
  icon: React.ReactNode;
  title: string;
  message: string;
  badge?: string;
  badgeColor?: "default" | "primary" | "secondary" | "error" | "warning" | "success" | "info";
};

function FeedbackCard({ icon, title, message, badge, badgeColor = "default" }: FeedbackCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ pb: "12px !important" }}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Box color="text.secondary" display="flex">{icon}</Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            {title}
          </Typography>
          {badge && (
            <Chip label={badge} color={badgeColor} size="small" sx={{ ml: "auto", fontSize: 11 }} />
          )}
        </Box>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
}

function getTrendIcon(status: string) {
  if (status === "increase") return <TrendingUpIcon fontSize="small" />;
  if (status === "decrease") return <TrendingDownIcon fontSize="small" />;
  return <TrendingFlatIcon fontSize="small" />;
}

function getTrendBadgeColor(status: string): FeedbackCardProps["badgeColor"] {
  if (status === "increase") return "error";
  if (status === "decrease") return "success";
  return "default";
}

function FeedbackSection({ feedback }: Props) {
  if (!feedback) return null;

  const items: FeedbackCardProps[] = [];

  if (feedback.monthlyTrend?.message) {
    const t = feedback.monthlyTrend;
    items.push({
      icon: getTrendIcon(t.status),
      title: "전월 대비",
      message: t.message,
      badge: t.status === "increase" ? "증가" : t.status === "decrease" ? "감소" : "유지",
      badgeColor: getTrendBadgeColor(t.status),
    });
  }

  if (feedback.weekCompare?.message) {
    const w = feedback.weekCompare;
    const isIncrease = w.diffPercent > 0;
    items.push({
      icon: <CompareArrowsIcon fontSize="small" />,
      title: "전주 대비",
      message: w.message,
      badge: isIncrease ? "증가" : "감소",
      badgeColor: isIncrease ? "warning" : "success",
    });
  }

  if (feedback.dailyAverageTrend?.message) {
    const d = feedback.dailyAverageTrend;
    items.push({
      icon: <BarChartIcon fontSize="small" />,
      title: "일평균 소비",
      message: d.message,
    });
  }

  if (feedback.weekdayPattern?.message) {
    items.push({
      icon: <BarChartIcon fontSize="small" />,
      title: "요일 패턴",
      message: feedback.weekdayPattern.message,
    });
  }

  if (feedback.hourlyPattern?.message) {
    items.push({
      icon: <AccessTimeIcon fontSize="small" />,
      title: "시간대 패턴",
      message: feedback.hourlyPattern.message,
    });
  }

  if (feedback.categoryPattern?.message) {
    items.push({
      icon: <CategoryIcon fontSize="small" />,
      title: "카테고리 과소비",
      message: feedback.categoryPattern.message,
      badge: `${(feedback.categoryPattern.ratio ?? 0).toFixed(0)}%`,
      badgeColor: feedback.categoryPattern.ratio >= 40 ? "error" : "warning",
    });
  }

  if (feedback.categoryConcentration?.message) {
    items.push({
      icon: <CategoryIcon fontSize="small" />,
      title: "지출 집중도",
      message: feedback.categoryConcentration.message,
    });
  }

  if (feedback.fixedVsVariable?.message) {
    const f = feedback.fixedVsVariable;
    items.push({
      icon: <CompareArrowsIcon fontSize="small" />,
      title: "고정 vs 변동",
      message: f.message,
      badge: `고정 ${(f.fixedRatio ?? 0).toFixed(0)}%`,
      badgeColor: f.fixedRatio >= 50 ? "warning" : "default",
    });
  }

  if (feedback.spikeDetection?.message) {
    items.push({
      icon: <BoltIcon fontSize="small" />,
      title: "지출 급증 탐지",
      message: feedback.spikeDetection.message,
      badge: "주의",
      badgeColor: "error",
    });
  }

  if (feedback.overSpendSequence?.message && (feedback.overSpendSequence.streak ?? 0) > 0) {
    items.push({
      icon: <WarningAmberIcon fontSize="small" />,
      title: "연속 증가",
      message: feedback.overSpendSequence.message,
      badge: `${feedback.overSpendSequence.streak}일 연속`,
      badgeColor: "error",
    });
  }

  if (feedback.targetProgress?.message) {
    const tp = feedback.targetProgress;
    items.push({
      icon: <BarChartIcon fontSize="small" />,
      title: "목표 달성률",
      message: tp.message,
      badge: tp.achieved ? "달성!" : `${(tp.ratio ?? 0).toFixed(0)}%`,
      badgeColor: tp.achieved ? "success" : (tp.ratio ?? 0) > 100 ? "error" : "primary",
    });
  }

  if (feedback.weeklyAverageTrend?.message) {
    items.push({
      icon: <TrendingUpIcon fontSize="small" />,
      title: "주간 평균 추이",
      message: feedback.weeklyAverageTrend.message,
    });
  }

  feedback.categoryMonthlyCompare?.forEach((c: CategoryMonthlyCompare) => {
    const isIncrease = c.changeRate > 0;
    items.push({
      icon: isIncrease ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />,
      title: `카테고리 전월 비교 · ${c.categoryName}`,
      message: c.message,
      badge: `${isIncrease ? "+" : ""}${(c.changeRate ?? 0).toFixed(1)}%`,
      badgeColor: isIncrease ? "error" : "success",
    });
  });

  if (!items.length) return null;

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        소비 피드백
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <FeedbackCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FeedbackSection;
