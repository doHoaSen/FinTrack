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
import { Box, Typography } from "@mui/material";
import type { WeekdayStat } from "../../features/dashboard/api";
import { normalizeWeekdayStats } from "./util/normalizeWeekdayStats";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip);

type Props = {
  data: WeekdayStat[];
};

const TODAY_INDEX = (() => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // 월=0 ... 일=6
})();

// 인덱스 기준: 0~4=평일, 5=토, 6=일
function getBarColor(i: number, isPeak: boolean, isToday: boolean, isEmpty: boolean, hover: boolean): string {
  if (isEmpty) return "rgba(0,0,0,0.05)";
  const alpha = (base: number) => hover ? Math.min(base + 0.2, 1) : base;

  if (i === 6) { // 일
    return isPeak
      ? `rgba(183,28,28,${alpha(0.9)})`
      : `rgba(239,83,80,${alpha(isToday ? 0.75 : 0.45)})`;
  }
  if (i === 5) { // 토
    return isPeak
      ? `rgba(0,105,92,${alpha(0.9)})`
      : `rgba(0,150,136,${alpha(isToday ? 0.75 : 0.45)})`;
  }
  // 평일
  return isPeak
    ? `rgba(13,71,161,${alpha(0.92)})`
    : `rgba(25,118,210,${alpha(isToday ? 0.78 : 0.45)})`;
}

function getTickColor(i: number): string {
  if (i === 6) return "#b71c1c";
  if (i === 5) return "#00695c";
  return "#999";
}

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

function WeekdayExpenseChart({ data }: Props) {
  const normalized = normalizeWeekdayStats(data);
  const amounts = normalized.map((d) => d.amount);
  const maxIdx = amounts.reduce((mi, a, i, arr) => (a > arr[mi] ? i : mi), 0);
  const avg = Math.round(amounts.reduce((s, a) => s + a, 0) / amounts.length);

  const backgroundColors = normalized.map((d, i) =>
    getBarColor(i, i === maxIdx, i === TODAY_INDEX, d.amount === 0, false)
  );
  const hoverColors = normalized.map((d, i) =>
    getBarColor(i, i === maxIdx, i === TODAY_INDEX, d.amount === 0, true)
  );

  const chartData = {
    labels: normalized.map((d) => d.day),
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
        data: Array(7).fill(avg),
        borderColor: "rgba(239,108,2,0.55)",
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0,
        order: 1,
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
        ...TOOLTIP_STYLE,
        filter: (item) => item.datasetIndex === 0,
        callbacks: {
          title: (items) => {
            const i = items[0].dataIndex;
            const suffix = i === 5 ? " (토)" : i === 6 ? " (일)" : "";
            return `${items[0].label}요일${suffix}`;
          },
          label: (ctx) =>
            ctx.parsed.y === 0 ? " 지출 없음" : ` ₩${ctx.parsed.y.toLocaleString()}`,
          afterLabel: (ctx) => {
            const diff = ctx.parsed.y - avg;
            if (ctx.parsed.y === 0 || avg === 0) return "";
            return ` 평균 대비 ${diff > 0 ? "+" : ""}₩${Math.abs(diff).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: (ctx) => getTickColor(ctx.index),
          font: (ctx) => ({
            size: 12,
            weight: ctx.index === maxIdx || ctx.index === TODAY_INDEX ? "bold" : "normal",
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
    <Box sx={{ width: "100%", height: 255 }}>
      <Chart type="bar" data={chartData as any} options={options as any} />
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
        <Box display="flex" gap={1.5}>
          {[
            { color: "rgba(25,118,210,0.6)", label: "평일" },
            { color: "rgba(0,150,136,0.6)", label: "토" },
            { color: "rgba(239,83,80,0.6)", label: "일" },
          ].map((item) => (
            <Box key={item.label} display="flex" alignItems="center" gap={0.5}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
              <Typography variant="caption" color="text.disabled">{item.label}</Typography>
            </Box>
          ))}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ width: 14, height: 2, bgcolor: "rgba(239,108,2,0.55)", borderRadius: 1 }} />
            <Typography variant="caption" color="text.disabled">평균</Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.disabled">* 이번 달 기준</Typography>
      </Box>
    </Box>
  );
}

export default WeekdayExpenseChart;
