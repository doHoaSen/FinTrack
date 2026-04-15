import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Typography } from "@mui/material";
import type { MonthlyStat } from "../../features/dashboard/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Props = {
  data: MonthlyStat[];
};

const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const CURRENT_MONTH = new Date().getMonth() + 1;

function MonthlyExpenseChart({ data }: Props) {
  if (!data.length) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
        이번 연도 소비 데이터가 없습니다.
      </Typography>
    );
  }

  const backgroundColors = data.map((d) =>
    d.month === CURRENT_MONTH
      ? "rgba(21, 101, 192, 0.9)"
      : "rgba(66, 165, 245, 0.5)"
  );
  const hoverColors = data.map((d) =>
    d.month === CURRENT_MONTH
      ? "rgba(21, 101, 192, 1)"
      : "rgba(66, 165, 245, 0.75)"
  );

  const chartData = {
    labels: data.map((d) => MONTH_LABELS[d.month - 1]),
    datasets: [
      {
        data: data.map((d) => d.amount),
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
    <div style={{ width: "100%", height: 250 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default MonthlyExpenseChart;
