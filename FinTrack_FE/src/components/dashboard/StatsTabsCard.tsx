import { Card, CardContent, Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import WeekdayExpenseChart from "./WeekdayExpenseChart";
import type { WeekdayStat } from "../../features/dashboard/api";

type TabKey = "weekday" | "category" | "hourly";

type Props = {
  weekdayStats: WeekdayStat[];
};


function StatsTabsCard({ weekdayStats }: Props) {
    const [tab, setTab] = useState<"weekday" | "category" | "hourly">("weekday");
    
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
            <Typography color="text.secondary">
              카테고리 그래프 준비 중
            </Typography>
          )}

          {tab === "hourly" && (
            <Typography color="text.secondary">
              시간대 그래프 준비 중
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatsTabsCard;