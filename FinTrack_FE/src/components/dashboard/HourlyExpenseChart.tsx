import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box } from "@mui/material";
import { useRef, useEffect } from "react";
import { normalizeHourlyStats } from "./util/normalizeHourlyStats";
import type { HourlyStat } from "./util/normalizeHourlyStats";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Tooltip);

type Props = {
  data: HourlyStat[];
};

const CURRENT_HOUR = new Date().getHours();

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(255,255,255,0.97)",
  titleColor: "#333",
  bodyColor: "#9c27b0",
  borderColor: "#e0e0e0",
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  titleFont: { size: 13, weight: "bold" as const },
  bodyFont: { size: 13 },
};

function HourlyExpenseChart({ data }: Props) {
  const chartRef = useRef<ChartJS<"line">>(null);
  const normalized = normalizeHourlyStats(data);

  const amounts = normalized.map((d) => d.amount);
  const maxAmount = Math.max(...amounts);
  const maxIdx = amounts.indexOf(maxAmount);

  // 그라디언트 fill 적용
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !chart.chartArea) return;
    const { ctx, chartArea: { top, bottom } } = chart;
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, "rgba(156, 39, 176, 0.35)");
    gradient.addColorStop(1, "rgba(156, 39, 176, 0.0)");
    chart.data.datasets[0].backgroundColor = gradient;
    chart.update("none");
  }, [data]);

  const pointColors = amounts.map((_, i) => {
    if (i === maxIdx && maxAmount > 0) return "#6a1b9a";
    return "transparent";
  });
  const pointRadius = amounts.map((_, i) =>
    i === maxIdx && maxAmount > 0 ? 5 : 0
  );
  const pointHoverRadius = amounts.map(() => 5);

  const chartData = {
    labels: normalized.map((d) => d.hour),
    datasets: [
      {
        data: amounts,
        borderColor: "rgba(156, 39, 176, 0.85)",
        borderWidth: 2.5,
        backgroundColor: "rgba(156, 39, 176, 0.15)", // 초기값 — useEffect에서 그라디언트로 교체됨
        fill: true,
        tension: 0.4,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointRadius,
        pointHoverRadius,
        pointHoverBackgroundColor: "#9c27b0",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 700, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...TOOLTIP_STYLE,
        callbacks: {
          title: (items) => {
            const hour = Number(items[0].label.replace("시", ""));
            const isCurrentHour = hour === CURRENT_HOUR;
            return `${items[0].label}${isCurrentHour ? " (현재)" : ""}`;
          },
          label: (ctx) =>
            ctx.parsed.y === 0
              ? " 지출 없음"
              : ` ₩${ctx.parsed.y.toLocaleString()}`,
        },
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
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <Box sx={{ width: "100%", height: 255 }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </Box>
  );
}

export default HourlyExpenseChart;
