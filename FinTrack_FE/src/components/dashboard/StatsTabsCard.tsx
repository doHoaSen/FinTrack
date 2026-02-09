import { Card, CardContent, Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import WeekdayExpenseChart from "./WeekdayExpenseChart";
import HourlyExpenseChart from "./HourlyExpenseChart";
import CategoryExpenseChart from "./CategoryExpenseChart";
import type { MonthlyStat, WeekdayStat } from "../../features/dashboard/api";
import type { HourlyStat } from "./util/normalizeHourlyStats";
import type { CategoryStat } from "./CategoryExpenseChart";

type TabKey = "weekday" | "category" | "hourly";

type Props = {
  weekdayStats: WeekdayStat[];
  hourlyStats: HourlyStat[];
  categoryStats: CategoryStat[];
  monthlyTotal: number;
};


function StatsTabsCard({ weekdayStats, hourlyStats, categoryStats, monthlyTotal }: Props) {
  const [tab, setTab] = useState<TabKey>("weekday");

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          이번 달 소비 패턴
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="요일별" value="weekday" />
          <Tab label="카테고리별" value="category" />
          <Tab label="시간대별" value="hourly" />
        </Tabs>

        <Box mt={3}>
          {tab === "weekday" && (
            <WeekdayExpenseChart data={weekdayStats} />
          )}

          {tab === "category" && (
            <CategoryExpenseChart data={categoryStats} total = {monthlyTotal} />
          )}

          {tab === "hourly" && (
            <HourlyExpenseChart data={hourlyStats} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatsTabsCard;