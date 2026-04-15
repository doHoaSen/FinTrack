import { Card, CardContent, Box, Typography, ButtonGroup, Button } from "@mui/material";
import { useState } from "react";
import WeekdayExpenseChart from "./WeekdayExpenseChart";
import HourlyExpenseChart from "./HourlyExpenseChart";
import CategoryExpenseChart from "./CategoryExpenseChart";
import MonthlyExpenseChart from "./MonthlyExpenseChart";
import type { MonthlyStat, WeekdayStat } from "../../features/dashboard/api";
import type { HourlyStat } from "./util/normalizeHourlyStats";
import type { CategoryStat } from "./CategoryExpenseChart";

type TabKey = "weekday" | "category" | "hourly" | "monthly";

type Props = {
  weekdayStats: WeekdayStat[];
  hourlyStats: HourlyStat[];
  categoryStats: CategoryStat[];
  monthlyStats: MonthlyStat[];
  monthlyTotal: number;
};

function StatsTabsCard({ weekdayStats, hourlyStats, categoryStats, monthlyStats, monthlyTotal }: Props) {
  const [tab, setTab] = useState<TabKey>("weekday");

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          이번 달 소비 패턴
        </Typography>

        <ButtonGroup size="small" sx={{ flexWrap: "wrap", gap: 0 }}>
          {(["weekday", "category", "hourly", "monthly"] as TabKey[]).map((key, idx) => {
            const labels: Record<TabKey, string> = {
              weekday: "요일별",
              category: "카테고리별",
              hourly: "시간대별",
              monthly: "월별",
            };
            const active = tab === key;
            return (
              <Button
                key={key}
                onClick={() => setTab(key)}
                variant={active ? "contained" : "outlined"}
                disableElevation
                sx={{
                  borderRadius: idx === 0 ? "20px 0 0 20px" : idx === 3 ? "0 20px 20px 0" : 0,
                  px: 2,
                  fontWeight: active ? 700 : 400,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {labels[key]}
              </Button>
            );
          })}
        </ButtonGroup>

        <Box mt={3}>
          {tab === "weekday" && (
            <WeekdayExpenseChart data={weekdayStats} />
          )}
          {tab === "category" && (
            <CategoryExpenseChart data={categoryStats} total={monthlyTotal} />
          )}
          {tab === "hourly" && (
            <HourlyExpenseChart data={hourlyStats} />
          )}
          {tab === "monthly" && (
            <MonthlyExpenseChart data={monthlyStats} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatsTabsCard;
