import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { getTargetApi } from "../features/target/api";
import { getDashboardApi } from "../features/dashboard/api";
import type { TargetResponse, MonthlyStat } from "../features/dashboard/api";
import TargetSettingDialog from "../components/dashboard/TargetSettingDialog";
import MonthlyExpenseChart from "../components/dashboard/MonthlyExpenseChart";

type CategoryStat = { name: string; amount: number };

const CATEGORY_COLORS = [
  "#1976d2",
  "#ed6c02",
  "#9c27b0",
  "#2e7d32",
  "#d32f2f",
  "#0288d1",
];

function BudgetPage() {
  const [target, setTarget] = useState<TargetResponse | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [targetData, dashboardData] = await Promise.all([
        getTargetApi(),
        getDashboardApi(),
      ]);
      setTarget(targetData);
      setMonthlyStats(dashboardData.monthlyStats);
      if (dashboardData.categoryTotals) {
        const sorted = Object.entries(dashboardData.categoryTotals)
          .map(([name, amount]) => ({ name, amount: Number(amount) }))
          .sort((a, b) => b.amount - a.amount);
        setCategoryStats(sorted);
      }
    } catch {
      setError("데이터를 불러오지 못했습니다.");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const hasTarget = target?.exists && target.targetAmount != null;
  const targetAmount = target?.targetAmount ?? 0;
  const usedAmount = target?.usedAmount ?? 0;
  const rawRatio = target?.ratio ?? 0;
  const ratio = Math.min(rawRatio, 100);
  const remaining = targetAmount - usedAmount;
  const isOver = hasTarget && rawRatio > 100;
  const isDanger = hasTarget && rawRatio >= 85;
  const isWarning = hasTarget && rawRatio >= 50 && rawRatio < 85;
  const progressColor = isOver || isDanger ? "error" : isWarning ? "warning" : "primary";
  const statusLabel = isOver ? "초과" : isDanger ? "위험" : isWarning ? "주의" : "양호";
  const statusColor = isOver || isDanger ? "error" : isWarning ? "warning" : "success";
  const borderColor = isOver || isDanger ? "error.main" : isWarning ? "warning.main" : "primary.main";

  const now = new Date();
  const month = now.getMonth() + 1;
  const totalSpent = categoryStats.reduce((sum, c) => sum + c.amount, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        BUDGET
      </Typography>

      {error && <Typography color="error" mb={2}>{error}</Typography>}

      <Grid container spacing={2}>
        {/* 예산 현황 카드 */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderLeft: 4, borderColor, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              {/* 헤더 */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                    {month}월 예산 현황
                  </Typography>
                  {hasTarget && (
                    <Chip
                      label={statusLabel}
                      color={statusColor}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: 12 }}
                    />
                  )}
                </Box>
                <Button
                  size="small"
                  variant={hasTarget ? "text" : "outlined"}
                  onClick={() => setDialogOpen(true)}
                  sx={{ minWidth: 0 }}
                >
                  {hasTarget ? "수정" : "예산 설정"}
                </Button>
              </Box>

              {hasTarget ? (
                <>
                  {/* 예산 / 지출 */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>예산</Typography>
                      <Typography variant="h3" fontWeight={700} color="primary.main" lineHeight={1}>
                        ₩{targetAmount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" color="text.secondary" mb={0.5}>지출</Typography>
                      <Typography
                        variant="h3"
                        fontWeight={700}
                        lineHeight={1}
                        color={isOver || isDanger ? "error.main" : isWarning ? "warning.main" : "text.primary"}
                      >
                        ₩{usedAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* 프로그레스 바 */}
                  <LinearProgress
                    variant="determinate"
                    value={ratio}
                    color={progressColor}
                    sx={{ height: 10, borderRadius: 5, mb: 1 }}
                  />
                  <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="body2" color={isOver ? "error.main" : "text.secondary"}>
                      {isOver
                        ? `₩${Math.abs(remaining).toLocaleString()} 초과`
                        : `남은 금액 ₩${remaining.toLocaleString()}`}
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      {rawRatio.toFixed(1)}% 사용
                    </Typography>
                  </Box>

                  {/* 하단 통계 */}
                  <Divider sx={{ mb: 2.5 }} />
                  <Box display="flex" justifyContent="space-around" textAlign="center">
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.75}>남은 일수</Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate()}일
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.75}>하루 가능 금액</Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={remaining <= 0 ? "error.main" : "text.primary"}
                      >
                        {remaining > 0
                          ? `₩${Math.floor(remaining / Math.max(1, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate())).toLocaleString()}`
                          : "—"}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.75}>사용률</Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={isOver || isDanger ? "error.main" : isWarning ? "warning.main" : "primary.main"}
                      >
                        {rawRatio.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box py={2}>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    이번 달 예산 목표를 설정하면 소비 현황을 한눈에 볼 수 있어요.
                  </Typography>
                  <Typography variant="h4" fontWeight={700} mb={1}>
                    ₩{usedAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    이번 달 총 지출
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 카테고리별 지출 */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
                카테고리별 지출
              </Typography>

              {categoryStats.length === 0 ? (
                <Typography variant="body2" color="text.disabled" textAlign="center" py={3}>
                  이번 달 지출 데이터가 없습니다.
                </Typography>
              ) : (
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {categoryStats.map((cat, idx) => {
                    const pct = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
                    const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                    return (
                      <Box key={cat.name}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" fontWeight={500}>
                            {cat.name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="text.secondary">
                              {pct.toFixed(1)}%
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ₩{cat.amount.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 월별 지출 추이 */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" mb={2}>
                월별 지출 추이
              </Typography>
              <MonthlyExpenseChart data={monthlyStats} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TargetSettingDialog
        open={dialogOpen}
        target={target}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchData}
      />
    </Box>
  );
}

export default BudgetPage;
