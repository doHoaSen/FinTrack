import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box } from "@mui/material";
import { normalizeHourlyStats } from "./util/normalizeHourlyStats";
import type { HourlyStat } from "./util/normalizeHourlyStats";

type Props = {
    data: HourlyStat[];
};

function HourlyExpenseChart({data}: Props){
    const chartData = normalizeHourlyStats(data);

    return (
    <Box sx={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} barCategoryGap={6}>
          <XAxis dataKey="hour" interval={2} />
          <YAxis
            tickFormatter={(v) =>
              typeof v === "number" ? `${v / 1000}k` : ""
            }
          />
          <Tooltip
            formatter={(value) =>
              typeof value === "number"
                ? `${value.toLocaleString()}원`
                : ""
            }
          />
          <Bar dataKey="amount" fill="#9c27b0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default HourlyExpenseChart;