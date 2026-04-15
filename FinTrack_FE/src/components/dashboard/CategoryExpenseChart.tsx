import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

export type CategoryStat = {
  name: string;
  amount: number;
};

type Props = {
  data: CategoryStat[];
  total: number;
};

const COLORS = [
  "rgba(25, 118, 210, 0.85)",
  "rgba(237, 108, 2, 0.85)",
  "rgba(156, 39, 176, 0.85)",
  "rgba(46, 125, 50, 0.85)",
  "rgba(211, 47, 47, 0.85)",
  "rgba(2, 136, 209, 0.85)",
  "rgba(245, 127, 23, 0.85)",
  "rgba(0, 105, 92, 0.85)",
];
const COLORS_SOLID = [
  "#1976d2","#ed6c02","#9c27b0","#2e7d32","#d32f2f","#0288d1","#f57f17","#00695c",
];

function CategoryExpenseChart({ data, total = 0 }: Props) {
  if (data.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2" textAlign="center" py={3}>
        이번 달 카테고리 지출이 없습니다.
      </Typography>
    );
  }

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: COLORS,
        hoverBackgroundColor: COLORS_SOLID,
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: "easeOutQuart" },
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
            return ` ${val.toLocaleString()}원 (${pct}%)`;
          },
        },
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#333",
        bodyColor: "#555",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <Box>
      {/* 도넛 차트 */}
      <Box sx={{ width: "100%", height: 220, position: "relative" }}>
        <Doughnut data={chartData} options={options} />

        {/* 중앙 총액 */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography variant="caption" color="text.disabled" display="block">
            이번 달
          </Typography>
          <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
            {(total / 10000).toFixed(0)}만원
          </Typography>
        </Box>
      </Box>

      {/* 커스텀 범례 */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 1.5 }}>
        {data.map((entry, idx) => {
          const pct = total > 0 ? ((entry.amount / total) * 100).toFixed(1) : "0";
          return (
            <Box key={entry.name} display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: COLORS_SOLID[idx % COLORS_SOLID.length], flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary">{entry.name}</Typography>
              <Typography variant="caption" fontWeight={600}>{pct}%</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default CategoryExpenseChart;
