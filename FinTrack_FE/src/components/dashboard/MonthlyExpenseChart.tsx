import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { MonthlyStat } from "../../features/dashboard/api";
import { Typography } from "@mui/material";

type Props = {
  data: MonthlyStat[];
};

const MONTH_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const currentMonth = new Date().getMonth() + 1;

function MonthlyExpenseChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: MONTH_LABELS[d.month - 1],
  }));

  if (!data.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        이번 연도 소비 데이터가 없습니다.
      </Typography>
    );
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
            tick={{ fontSize: 11 }}
            width={45}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toLocaleString()}원`, "소비"]}
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.month}
                fill={entry.month === currentMonth ? "#1976d2" : "#90caf9"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyExpenseChart;
