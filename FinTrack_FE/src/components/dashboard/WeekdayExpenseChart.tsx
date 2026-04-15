import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import type { WeekdayStat } from "../../features/dashboard/api";
import { normalizeWeekdayStats } from "./util/normalizeWeekdayStats";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  data: WeekdayStat[];
};

const TODAY_INDEX = (() => {
  const d = new Date().getDay(); // 0=일
  return d === 0 ? 6 : d - 1;   // 월=0 ... 일=6
})();

function WeekdayExpenseChart({ data }: Props) {
  const normalized = normalizeWeekdayStats(data);

  const backgroundColors = normalized.map((_, i) =>
    i === TODAY_INDEX
      ? "rgba(21, 101, 192, 0.9)"
      : "rgba(25, 118, 210, 0.55)"
  );
  const hoverColors = normalized.map((_, i) =>
    i === TODAY_INDEX
      ? "rgba(21, 101, 192, 1)"
      : "rgba(25, 118, 210, 0.8)"
  );

  const chartData = {
    labels: normalized.map((d) => d.day),
    datasets: [
      {
        data: normalized.map((d) => d.amount),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 8,
        borderSkipped: false as const,
        barPercentage: 0.55,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toLocaleString()}원`,
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
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#999", font: { size: 12 } },
      },
      y: {
        grid: { color: "#f0f0f0" },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "#bbb",
          font: { size: 11 },
          callback: (v) => `${(Number(v) / 10000).toFixed(0)}만`,
        },
      },
    },
  };

  return (
    <Box sx={{ width: "100%", height: 260 }}>
      <Bar data={chartData} options={options} />
      <Typography variant="caption" color="text.disabled" display="block" textAlign="right" mt={0.5}>
        * 이번 달 기준
      </Typography>
    </Box>
  );
}

export default WeekdayExpenseChart;
