import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Typography } from "@mui/material";
import type { MonthlyStat } from "../../features/dashboard/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip);

type Props = {
  data: MonthlyStat[];
};

const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const CURRENT_MONTH = new Date().getMonth() + 1;

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(255,255,255,0.97)",
  titleColor: "#333",
  bodyColor: "#555",
  borderColor: "#e0e0e0",
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  titleFont: { size: 13, weight: "bold" as const },
  bodyFont: { size: 13 },
};

function MonthlyExpenseChart({ data }: Props) {
  if (!data.length) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
        이번 연도 소비 데이터가 없습니다.
      </Typography>
    );
  }

  const amounts = data.map((d) => d.amount);
  const avg = Math.round(amounts.reduce((s, a) => s + a, 0) / amounts.length);
  const maxIdx = amounts.reduce((mi, a, i, arr) => (a > arr[mi] ? i : mi), 0);

  const backgroundColors = data.map((d, i) => {
    if (i === maxIdx) return "rgba(13, 71, 161, 0.92)";
    if (d.month === CURRENT_MONTH) return "rgba(25, 118, 210, 0.82)";
    return "rgba(66, 165, 245, 0.45)";
  });
  const hoverColors = data.map((d, i) => {
    if (i === maxIdx) return "rgba(13, 71, 161, 1)";
    if (d.month === CURRENT_MONTH) return "rgba(25, 118, 210, 1)";
    return "rgba(66, 165, 245, 0.7)";
  });

  const chartData = {
    labels: data.map((d) => MONTH_LABELS[d.month - 1]),
    datasets: [
      {
        type: "bar" as const,
        data: amounts,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 8,
        borderSkipped: false as const,
        barPercentage: 0.55,
        categoryPercentage: 0.7,
        order: 2,
      },
      {
        type: "line" as const,
        data: Array(data.length).fill(avg),
        borderColor: "rgba(239, 108, 2, 0.6)",
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0,
        order: 1,
        label: `평균 ${avg.toLocaleString()}원`,
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
        ...TOOLTIP_STYLE,
        filter: (item) => item.datasetIndex === 0, // 바 데이터만 툴팁
        callbacks: {
          title: (items) => items[0].label,
          label: (ctx) => ` ₩${(ctx.parsed.y as number).toLocaleString()}`,
          afterLabel: (ctx) => {
            const diff = (ctx.parsed.y as number) - avg;
            return diff === 0
              ? ""
              : ` 평균 대비 ${diff > 0 ? "+" : ""}${Math.abs(diff).toLocaleString()}원`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: (ctx) => {
            const d = data[ctx.index];
            if (!d) return "#aaa";
            if (ctx.index === maxIdx) return "#0d47a1";
            if (d.month === CURRENT_MONTH) return "#1976d2";
            return "#aaa";
          },
          font: (ctx) => ({
            size: 12,
            weight:
              ctx.index === maxIdx || data[ctx.index]?.month === CURRENT_MONTH
                ? "bold"
                : "normal",
          }),
        },
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
    <div style={{ width: "100%", height: 255 }}>
      <Chart type="bar" data={chartData as any} options={options as any} />
    </div>
  );
}

export default MonthlyExpenseChart;
