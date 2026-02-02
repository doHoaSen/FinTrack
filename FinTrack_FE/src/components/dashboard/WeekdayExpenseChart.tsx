import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import type { WeekdayStat } from "../../features/dashboard/api";
import { normalizeWeekdayStats } from "./util/normalizeWeekdayStats";

type Props = {
    data: WeekdayStat[];
}

function WeekdayExpenseChart({ data }: Props) {
    const chartData = normalizeWeekdayStats(data);

    return (
        <Box sx={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} barCategoryGap={24}>
                    <XAxis dataKey="day" />
                    <YAxis
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        formatter={(value) =>
                            typeof value === "number"
                                ? `${value.toLocaleString()}원`
                                : ""
                        }
                    />
                    <Bar
                        dataKey="amount"
                        fill="#1976d2"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                textAlign="right"
                mt={1}
            >
                * 이번 달 기준
            </Typography>
        </Box>
    );
}

export default WeekdayExpenseChart;