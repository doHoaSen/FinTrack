import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Stack,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";

import { getExpenseApi } from "../../features/expense/api";
import type { Category } from "../../features/category/type";
import type { Expense } from "../../store/expenseStore";
import type { SvgIconComponent } from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type IconMeta = { icon: SvgIconComponent; color: string; bg: string };

type Props = {
  category: Category;
  meta: IconMeta;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function CategoryDetailDialog({ category, meta, onClose, onEdit, onDelete }: Props) {
  const Icon = meta.icon;

  const [loading, setLoading] = useState(true);
  const [thisMonthExpenses, setThisMonthExpenses] = useState<Expense[]>([]);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [trendAmounts, setTrendAmounts] = useState<number[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const now = dayjs();

      // 이번 달 지출
      const thisRes = await getExpenseApi({
        year: now.year(),
        month: now.month() + 1,
        categoryId: category.id,
        page: 0,
        size: 1000,
      });
      const thisExpenses: Expense[] = thisRes.content;
      setThisMonthExpenses(thisExpenses);

      // 지난달 지출
      const lastMonth = now.subtract(1, "month");
      const lastRes = await getExpenseApi({
        year: lastMonth.year(),
        month: lastMonth.month() + 1,
        categoryId: category.id,
        page: 0,
        size: 1000,
      });
      setLastMonthTotal(
        (lastRes.content as Expense[]).reduce((s, e) => s + e.amount, 0)
      );

      // 최근 6개월 추이
      const months = Array.from({ length: 6 }, (_, i) => now.subtract(5 - i, "month"));
      const trendResults = await Promise.all(
        months.map((m) =>
          getExpenseApi({
            year: m.year(),
            month: m.month() + 1,
            categoryId: category.id,
            page: 0,
            size: 1000,
          })
        )
      );

      setTrendLabels(months.map((m) => `${m.month() + 1}월`));
      setTrendAmounts(
        trendResults.map((r) =>
          (r.content as Expense[]).reduce((s, e) => s + e.amount, 0)
        )
      );

      setLoading(false);
    };

    fetchAll();
  }, [category.id]);

  const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const changeRate =
    lastMonthTotal > 0
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      : null;
  const avgAmount =
    thisMonthExpenses.length > 0
      ? Math.round(thisMonthTotal / thisMonthExpenses.length)
      : 0;

  const chartData = {
    labels: trendLabels,
    datasets: [
      {
        data: trendAmounts,
        backgroundColor: trendAmounts.map((_, i) =>
          i === trendAmounts.length - 1 ? meta.color : `${meta.color}66`
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions: React.ComponentProps<typeof Bar>["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `₩${ctx.parsed.y.toLocaleString()}` } },
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        grid: { color: "#f0f0f0" },
        border: { display: false },
        ticks: { callback: (v) => `₩${Number(v).toLocaleString()}` },
      },
    },
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        {/* 닫기 버튼 */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ p: 3 }}>
          {/* 헤더 */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ width: 52, height: 52, bgcolor: meta.bg, flexShrink: 0 }}>
              <Icon sx={{ fontSize: 26, color: meta.color }} />
            </Avatar>

            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" fontWeight={700}>
                  {category.name}
                </Typography>
                <Chip
                  label={category.type === "FIXED" ? "고정비" : "변동비"}
                  size="small"
                  sx={{
                    fontSize: 11,
                    height: 20,
                    fontWeight: 600,
                    ...(category.type === "FIXED"
                      ? { bgcolor: "#EEF2FF", color: "#3B5BDB" }
                      : { bgcolor: "#FEF3C7", color: "#D97706" }),
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.disabled">
                이번 달 기준
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexShrink={0}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditOutlinedIcon fontSize="small" />}
                onClick={onEdit}
                sx={{ borderRadius: 2, borderColor: "divider", color: "text.secondary" }}
              >
                수정
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={onDelete}
                sx={{ borderRadius: 2, borderColor: "divider", color: "error.main" }}
              >
                삭제
              </Button>
            </Stack>
          </Box>

          {/* 이번 달 총액 + 전월 대비 */}
          <Box mb={3}>
            <Typography variant="caption" color="text.disabled" fontWeight={600} letterSpacing={1}>
              MONTHLY TOTAL
            </Typography>
            <Box display="flex" alignItems="baseline" gap={1.5} mt={0.5}>
              {loading ? (
                <Skeleton width={180} height={48} />
              ) : (
                <>
                  <Typography variant="h4" fontWeight={700}>
                    ₩{thisMonthTotal.toLocaleString()}
                  </Typography>
                  {changeRate !== null && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={0.3}
                      sx={{ color: changeRate >= 0 ? "error.main" : "success.main" }}
                    >
                      {changeRate >= 0 ? (
                        <TrendingUpIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 16 }} />
                      )}
                      <Typography variant="body2" fontWeight={600}>
                        {Math.abs(changeRate).toFixed(1)}%
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>

          {/* 중단: 차트 + 통계 */}
          <Grid container spacing={2.5} mb={3}>
            {/* 지출 추이 차트 */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: 2.5,
                  height: 220,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="body2" fontWeight={600}>
                    지출 추이
                  </Typography>
                  <Typography variant="caption" color="text.disabled" fontWeight={600} letterSpacing={0.5}>
                    LAST 6 MONTHS
                  </Typography>
                </Box>
                {loading ? (
                  <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                ) : (
                  <Box height={150}>
                    <Bar data={chartData} options={chartOptions} />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* 이번 달 통계 */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #3B5BDB 0%, #4C6EF5 100%)",
                  borderRadius: 3,
                  p: 2.5,
                  height: 220,
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600, letterSpacing: 0.5 }}>
                    이번 달 총 거래 수
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5}>
                    {loading ? "..." : `${thisMonthExpenses.length}건`}
                  </Typography>
                  
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    건당 평균
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {loading ? "..." : `₩${avgAmount.toLocaleString()}`}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    전월 대비
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {loading || changeRate === null
                      ? "데이터 없음"
                      : changeRate >= 0
                      ? `+${changeRate.toFixed(1)}% 증가`
                      : `${changeRate.toFixed(1)}% 감소`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* 최근 지출 내역 */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography variant="body1" fontWeight={700}>
              최근 지출 내역
            </Typography>
            <Typography variant="caption" color="text.disabled">
              이번 달
            </Typography>
          </Box>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {loading ? (
              <Box p={2}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} height={48} sx={{ mb: 0.5 }} />
                ))}
              </Box>
            ) : thisMonthExpenses.length === 0 ? (
              <Box py={5} textAlign="center">
                <Typography variant="body2" color="text.disabled">
                  이번 달 지출 내역이 없습니다.
                </Typography>
              </Box>
            ) : (
              <Table size="small">
                <TableBody>
                  {thisMonthExpenses.slice(0, 5).map((e) => (
                    <TableRow
                      key={e.id}
                      sx={{ "&:hover": { bgcolor: "grey.50" } }}
                    >
                      <TableCell sx={{ py: 1.25, px: 2, color: "text.disabled", width: 110 }}>
                        <Typography variant="caption">
                          {e.expenseAt ? dayjs(e.expenseAt).format("YYYY.MM.DD") : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.25, px: 2 }}>
                        <Typography variant="body2">
                          {e.memo || category.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.25, px: 2 }}>
                        <Typography variant="body2" fontWeight={700}>
                          ₩{e.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryDetailDialog;
