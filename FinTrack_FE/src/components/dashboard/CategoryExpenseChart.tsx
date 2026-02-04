import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

export type CategoryStat = {
  name: string;
  amount: number;
};

type Props = {
  data: CategoryStat[];
  total: number;
};

const COLORS = [
  "#2e7d32",
  "#1976d2",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
  "#0288d1",
];

function CategoryExpenseChart({ data, total = 0 }: Props) {
  if (data.length === 0) {
    return (
      <Typography color="text.secondary">
        이번 달 카테고리 지출이 없습니다.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", height: 260, position: "relative" }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((_, idx) => (
              <Cell
                key={idx}
                fill={COLORS[idx % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) =>
              typeof value === "number"
                ? [`${value.toLocaleString()}원`, name]
                : []
            }
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 중앙 총액 */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          이번 달 소비
        </Typography>
        <Typography variant="h6" fontWeight={700}>
          {total.toLocaleString()}원
        </Typography>
      </Box>
    </Box>
  );
}


export default CategoryExpenseChart;
