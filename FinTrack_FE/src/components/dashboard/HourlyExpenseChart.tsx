import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";
import { normalizeHourlyStats } from "./util/normalizeHourlyStats";
import type { HourlyStat } from "./util/normalizeHourlyStats";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Props = {
  data: HourlyStat[];
};

const CURRENT_HOUR = new Date().getHours();

function HourlyExpenseChart({ data }: Props) {
  const normalized = normalizeHourlyStats(data);

  const backgroundColors = normalized.map((_, i) =>
    i === CURRENT_HOUR
      ? "rgba(106, 27, 154, 0.9)"
      : "rgba(156, 39, 176, 0.5)"
  );
  const hoverColors = normalized.map((_, i) =>
    i === CURRENT_HOUR
      ? "rgba(106, 27, 154, 1)"
      : "rgba(156, 39, 176, 0.75)"
  );

  const chartData = {
    labels: normalized.map((d) => d.hour),
    datasets: [
      {
        data: normalized.map((d) => d.amount),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 4,
        borderSkipped: false as const,
        barPercentage: 0.7,
        categoryPercentage: 0.85,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: "easeOutQuart" },
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
        ticks: {
          color: "#bbb",
          font: { size: 10 },
          maxRotation: 0,
          callback: (_val, idx) => (idx % 3 === 0 ? `${idx}시` : ""),
        },
      },
      y: {
        grid: { color: "#f0f0f0" },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "#bbb",
          font: { size: 11 },
          callback: (v) =>
            Number(v) >= 10000
              ? `${(Number(v) / 10000).toFixed(0)}만`
              : `${(Number(v) / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <Box sx={{ width: "100%", height: 260 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
}

export default HourlyExpenseChart;
