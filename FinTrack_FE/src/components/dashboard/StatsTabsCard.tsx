import { Card, CardContent, Box, Typography, ButtonGroup, Button, Fade } from "@mui/material";
import { useMemo, useState } from "react";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import WeekdayExpenseChart from "./WeekdayExpenseChart";
import HourlyExpenseChart from "./HourlyExpenseChart";
import CategoryExpenseChart from "./CategoryExpenseChart";
import MonthlyExpenseChart from "./MonthlyExpenseChart";
import type { MonthlyStat, WeekdayStat } from "../../features/dashboard/api";
import type { HourlyStat } from "./util/normalizeHourlyStats";
import type { CategoryStat } from "./CategoryExpenseChart";

type TabKey = "weekday" | "category" | "hourly" | "monthly";

const TAB_LABELS: Record<TabKey, string> = {
  weekday: "요일별",
  category: "카테고리별",
  hourly: "시간대별",
  monthly: "월별",
};
const TAB_KEYS: TabKey[] = ["weekday", "category", "hourly", "monthly"];
const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

type Props = {
  weekdayStats: WeekdayStat[];
  hourlyStats: HourlyStat[];
  categoryStats: CategoryStat[];
  monthlyStats: MonthlyStat[];
  monthlyTotal: number;
};

function StatsTabsCard({ weekdayStats, hourlyStats, categoryStats, monthlyStats, monthlyTotal }: Props) {
  const [tab, setTab] = useState<TabKey>("weekday");

  const peakInsight = useMemo(() => {
    switch (tab) {
      case "weekday": {
        if (!weekdayStats.length) return null;
        const peak = weekdayStats.reduce((a, b) => a.amount > b.amount ? a : b);
        if (peak.amount === 0) return null;
        return `${WEEKDAY_LABELS[peak.weekday - 1]}요일에 이번 달 지출이 가장 많아요 — ₩${peak.amount.toLocaleString()}`;
      }
      case "hourly": {
        if (!hourlyStats.length) return null;
        const peak = hourlyStats.reduce((a, b) => a.amount > b.amount ? a : b);
        if (peak.amount === 0) return null;
        return `${peak.hour}시대에 지출이 가장 집중돼요 — ₩${peak.amount.toLocaleString()}`;
      }
      case "monthly": {
        if (!monthlyStats.length) return null;
        const peak = monthlyStats.reduce((a, b) => a.amount > b.amount ? a : b);
        if (peak.amount === 0) return null;
        return `${MONTH_LABELS[peak.month - 1]}에 지출이 가장 많았어요 — ₩${peak.amount.toLocaleString()}`;
      }
      case "category": {
        if (!categoryStats.length) return null;
        const peak = categoryStats.reduce((a, b) => a.amount > b.amount ? a : b);
        if (peak.amount === 0) return null;
        const pct = monthlyTotal > 0 ? ((peak.amount / monthlyTotal) * 100).toFixed(0) : 0;
        return `${peak.name}이(가) 전체 지출의 ${pct}%로 가장 많아요`;
      }
    }
  }, [tab, weekdayStats, hourlyStats, monthlyStats, categoryStats, monthlyTotal]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
          이번 달 소비 패턴
        </Typography>

        {/* 탭 pill 버튼 */}
        <ButtonGroup size="small" sx={{ flexWrap: "wrap", gap: 0 }}>
          {TAB_KEYS.map((key, idx) => {
            const active = tab === key;
            return (
              <Button
                key={key}
                onClick={() => setTab(key)}
                variant={active ? "contained" : "outlined"}
                disableElevation
                sx={{
                  borderRadius:
                    idx === 0 ? "20px 0 0 20px" :
                    idx === TAB_KEYS.length - 1 ? "0 20px 20px 0" : 0,
                  px: 2,
                  fontWeight: active ? 700 : 400,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                {TAB_LABELS[key]}
              </Button>
            );
          })}
        </ButtonGroup>

        {/* 피크 인사이트 */}
        <Box sx={{ minHeight: 24, mt: 1.5, mb: 0.5 }}>
          <Fade in={!!peakInsight} timeout={400}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <LightbulbOutlinedIcon sx={{ fontSize: 13, color: "primary.main" }} />
              <Typography variant="caption" color="text.secondary">
                {peakInsight ?? ""}
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* 차트 — 탭 전환 시 Fade 애니메이션 */}
        <Fade key={tab} in timeout={350}>
          <Box mt={1}>
            {tab === "weekday" && <WeekdayExpenseChart data={weekdayStats} />}
            {tab === "category" && <CategoryExpenseChart data={categoryStats} total={monthlyTotal} />}
            {tab === "hourly" && <HourlyExpenseChart data={hourlyStats} />}
            {tab === "monthly" && <MonthlyExpenseChart data={monthlyStats} />}
          </Box>
        </Fade>
      </CardContent>
    </Card>
  );
}

export default StatsTabsCard;
