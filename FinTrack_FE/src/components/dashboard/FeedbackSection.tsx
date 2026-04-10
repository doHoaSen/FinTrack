import { useRef, useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, IconButton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import BoltIcon from "@mui/icons-material/Bolt";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { FeedbackResponse, CategoryMonthlyCompare } from "../../features/dashboard/api";

type Props = {
  feedback: FeedbackResponse | null;
};

type FeedbackCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  message: string;
  badge?: string;
  badgeColor?: "default" | "primary" | "secondary" | "error" | "warning" | "success" | "info";
};

const CARD_GAP = 12;

function FeedbackCard({ icon, iconBg, title, message, badge, badgeColor = "default" }: FeedbackCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: "0 0 calc(22% - 9px)",
        minWidth: 180,
        borderRadius: 3,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* 아이콘 */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.5,
          }}
        >
          {icon}
        </Box>

        {/* 타이틀 + 뱃지 */}
        <Box display="flex" alignItems="center" gap={0.5} mb={0.75} flexWrap="wrap">
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.4, fontSize: 10 }}>
            {title}
          </Typography>
          {badge && (
            <Chip label={badge} color={badgeColor} size="small" sx={{ fontSize: 10, height: 18 }} />
          )}
        </Box>

        {/* 메시지 */}
        <Typography variant="body2" sx={{ lineHeight: 1.6, color: "text.primary", wordBreak: "keep-all" }}>
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
}

function getTrendIcon(status: string, color: string) {
  if (status === "increase") return <TrendingUpIcon sx={{ color, fontSize: 20 }} />;
  if (status === "decrease") return <TrendingDownIcon sx={{ color, fontSize: 20 }} />;
  return <TrendingFlatIcon sx={{ color, fontSize: 20 }} />;
}

function FeedbackSection({ feedback }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    el?.addEventListener("scroll", updateArrows);
    return () => el?.removeEventListener("scroll", updateArrows);
  }, [feedback]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth / 2;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  if (!feedback) return null;

  const items: FeedbackCardProps[] = [];

  if (feedback.monthlyTrend?.message) {
    const t = feedback.monthlyTrend;
    const isIncrease = t.status === "increase";
    items.push({
      icon: getTrendIcon(t.status, isIncrease ? "#ef4444" : "#22c55e"),
      iconBg: isIncrease ? "#fee2e2" : "#dcfce7",
      title: "전월 대비",
      message: t.message,
      badge: isIncrease ? "증가" : t.status === "decrease" ? "감소" : "유지",
      badgeColor: isIncrease ? "error" : "success",
    });
  }

  if (feedback.weekCompare?.message) {
    const w = feedback.weekCompare;
    const isIncrease = w.diffPercent > 0;
    items.push({
      icon: <CompareArrowsIcon sx={{ color: isIncrease ? "#f97316" : "#3b82f6", fontSize: 20 }} />,
      iconBg: isIncrease ? "#ffedd5" : "#dbeafe",
      title: "전주 대비",
      message: w.message,
      badge: isIncrease ? "증가" : "감소",
      badgeColor: isIncrease ? "warning" : "primary",
    });
  }

  if (feedback.dailyAverageTrend?.message) {
    items.push({
      icon: <BarChartIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />,
      iconBg: "#ede9fe",
      title: "일평균 소비",
      message: feedback.dailyAverageTrend.message,
    });
  }

  if (feedback.weekdayPattern?.message) {
    items.push({
      icon: <BarChartIcon sx={{ color: "#0ea5e9", fontSize: 20 }} />,
      iconBg: "#e0f2fe",
      title: "요일 패턴",
      message: feedback.weekdayPattern.message,
    });
  }

  if (feedback.hourlyPattern?.message) {
    items.push({
      icon: <AccessTimeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />,
      iconBg: "#fef3c7",
      title: "시간대 패턴",
      message: feedback.hourlyPattern.message,
    });
  }

  if (feedback.categoryPattern?.message) {
    const ratio = feedback.categoryPattern.ratio ?? 0;
    items.push({
      icon: <CategoryIcon sx={{ color: "#ef4444", fontSize: 20 }} />,
      iconBg: "#fee2e2",
      title: "카테고리 과소비",
      message: feedback.categoryPattern.message,
      badge: `${ratio.toFixed(0)}%`,
      badgeColor: ratio >= 40 ? "error" : "warning",
    });
  }

  if (feedback.categoryConcentration?.message) {
    items.push({
      icon: <CategoryIcon sx={{ color: "#6366f1", fontSize: 20 }} />,
      iconBg: "#e0e7ff",
      title: "지출 집중도",
      message: feedback.categoryConcentration.message,
    });
  }

  if (feedback.fixedVsVariable?.message) {
    const f = feedback.fixedVsVariable;
    items.push({
      icon: <CompareArrowsIcon sx={{ color: "#10b981", fontSize: 20 }} />,
      iconBg: "#d1fae5",
      title: "고정 vs 변동",
      message: f.message,
      badge: `고정 ${(f.fixedRatio ?? 0).toFixed(0)}%`,
      badgeColor: f.fixedRatio >= 50 ? "warning" : "default",
    });
  }

  if (feedback.spikeDetection?.message) {
    items.push({
      icon: <BoltIcon sx={{ color: "#ef4444", fontSize: 20 }} />,
      iconBg: "#fee2e2",
      title: "지출 급증 탐지",
      message: feedback.spikeDetection.message,
      badge: "주의",
      badgeColor: "error",
    });
  }

  if (feedback.overSpendSequence?.message && (feedback.overSpendSequence.streak ?? 0) > 0) {
    items.push({
      icon: <WarningAmberIcon sx={{ color: "#ef4444", fontSize: 20 }} />,
      iconBg: "#fee2e2",
      title: "연속 증가",
      message: feedback.overSpendSequence.message,
      badge: `${feedback.overSpendSequence.streak}일 연속`,
      badgeColor: "error",
    });
  }

  if (feedback.targetProgress?.message) {
    const tp = feedback.targetProgress;
    items.push({
      icon: <BarChartIcon sx={{ color: tp.achieved ? "#22c55e" : "#3b82f6", fontSize: 20 }} />,
      iconBg: tp.achieved ? "#dcfce7" : "#dbeafe",
      title: "목표 달성률",
      message: tp.message,
      badge: tp.achieved ? "달성!" : `${(tp.ratio ?? 0).toFixed(0)}%`,
      badgeColor: tp.achieved ? "success" : (tp.ratio ?? 0) > 100 ? "error" : "primary",
    });
  }

  if (feedback.weeklyAverageTrend?.message) {
    items.push({
      icon: <TrendingUpIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />,
      iconBg: "#ede9fe",
      title: "주간 평균 추이",
      message: feedback.weeklyAverageTrend.message,
    });
  }

  feedback.categoryMonthlyCompare?.forEach((c: CategoryMonthlyCompare) => {
    const isIncrease = c.changeRate > 0;
    items.push({
      icon: isIncrease
        ? <TrendingUpIcon sx={{ color: "#ef4444", fontSize: 20 }} />
        : <TrendingDownIcon sx={{ color: "#22c55e", fontSize: 20 }} />,
      iconBg: isIncrease ? "#fee2e2" : "#dcfce7",
      title: `${c.categoryName} 전월 비교`,
      message: c.message,
      badge: `${isIncrease ? "+" : ""}${(c.changeRate ?? 0).toFixed(1)}%`,
      badgeColor: isIncrease ? "error" : "success",
    });
  });

  if (!items.length) return null;

  return (
    <Box>
      {/* 헤더 */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box>
          <Box display="flex" alignItems="center" gap={0.75}>
            <AutoAwesomeIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography variant="subtitle1" fontWeight={700}>
              스마트 인사이트
            </Typography>
          </Box>
          <Typography variant="caption" color="text.disabled" sx={{ letterSpacing: 0.5 }}>
            FinTrack AI
          </Typography>
        </Box>

        {/* 화살표 */}
        <Box display="flex" gap={0.5}>
          <IconButton size="small" onClick={() => scroll("left")} disabled={!canLeft}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => scroll("right")} disabled={!canRight}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* 캐러셀 */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: `${CARD_GAP}px`,
          overflowX: "auto",
          pb: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {items.map((item, i) => (
          <FeedbackCard key={i} {...item} />
        ))}
      </Box>
    </Box>
  );
}

export default FeedbackSection;
