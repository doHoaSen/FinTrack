import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export type CategoryStat = {
  name: string;
  amount: number;
};

type Props = {
  data: CategoryStat[];
  total: number;
};

const COLORS = [
  "rgba(25, 118, 210, 0.82)",
  "rgba(237, 108, 2, 0.82)",
  "rgba(156, 39, 176, 0.82)",
  "rgba(46, 125, 50, 0.82)",
  "rgba(211, 47, 47, 0.82)",
  "rgba(2, 136, 209, 0.82)",
  "rgba(245, 127, 23, 0.82)",
  "rgba(0, 105, 92, 0.82)",
];
const COLORS_HOVER = [
  "#1976d2","#ed6c02","#9c27b0","#2e7d32","#d32f2f","#0288d1","#f57f17","#00695c",
];

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

// 바 끝에 퍼센트 레이블을 그리는 인라인 플러그인
function makeLabelPlugin(total: number): Plugin<"bar"> {
  return {
    id: "pctLabels",
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      ctx.save();
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#999";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      chart.getDatasetMeta(0).data.forEach((bar, i) => {
        const val = (data.datasets[0].data[i] as number) ?? 0;
        if (val === 0) return;
        const pct = total > 0 ? ((val / total) * 100).toFixed(0) : "0";
        ctx.fillText(`${pct}%`, (bar as any).x + 6, (bar as any).y);
      });
      ctx.restore();
    },
  };
}

function CategoryExpenseChart({ data, total = 0 }: Props) {
  if (data.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2" textAlign="center" py={3}>
        이번 달 카테고리 지출이 없습니다.
      </Typography>
    );
  }

  const sorted = [...data].sort((a, b) => b.amount - a.amount);
  const chartHeight = Math.max(200, sorted.length * 44 + 40);

  const chartData = {
    labels: sorted.map((d) => d.name),
    datasets: [
      {
        data: sorted.map((d) => d.amount),
        backgroundColor: sorted.map((_, i) => COLORS[i % COLORS.length]),
        hoverBackgroundColor: sorted.map((_, i) => COLORS_HOVER[i % COLORS_HOVER.length]),
        borderRadius: 6,
        borderSkipped: false as const,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const maxAmount = sorted[0]?.amount ?? 1;

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 650, easing: "easeOutQuart" },
    layout: { padding: { right: 40 } }, // 레이블 공간 확보
    plugins: {
      legend: { display: false },
      tooltip: {
        ...TOOLTIP_STYLE,
        callbacks: {
          title: (items) => items[0].label,
          label: (ctx) => {
            const val = ctx.parsed.x;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
            return ` ₩${val.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#f0f0f0" },
        border: { display: false, dash: [4, 4] },
        max: maxAmount * 1.25, // 레이블 공간
        ticks: {
          color: "#bbb",
          font: { size: 11 },
          callback: (v) => `${(Number(v) / 10000).toFixed(0)}만`,
        },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#555",
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <Box>
      {/* 총액 요약 */}
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Typography variant="caption" color="text.disabled">
          이번 달 총 지출&nbsp;
          <Typography component="span" variant="caption" fontWeight={700} color="text.primary">
            ₩{total.toLocaleString()}
          </Typography>
        </Typography>
      </Box>

      {/* 가로 바 차트 */}
      <Box sx={{ width: "100%", height: chartHeight }}>
        <Bar
          data={chartData}
          options={options}
          plugins={[makeLabelPlugin(total)]}
        />
      </Box>
    </Box>
  );
}

export default CategoryExpenseChart;
