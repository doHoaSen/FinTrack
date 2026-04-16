import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import type { TargetResponse } from "../../features/dashboard/api";

type Props = {
  monthlyTotal: number;
  target: TargetResponse | null;
  onSetTarget: () => void;
};

function getRemainingDays(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

function getSpendingColor(ratio: number): string {
  if (ratio >= 85) return "error.main";
  if (ratio >= 50) return "warning.main";
  return "text.primary";
}

function SummarySection({ monthlyTotal, target, onSetTarget }: Props) {
  const now = new Date();
  const month = now.getMonth() + 1;

  const hasTarget = target?.exists && target.targetAmount != null;
  const targetAmount = target?.targetAmount ?? 0;
  const usedAmount = hasTarget ? target!.usedAmount : monthlyTotal;
  const remaining = targetAmount - usedAmount;
  const rawRatio = hasTarget ? (target?.ratio ?? 0) : 0;
  const ratio = Math.min(rawRatio, 100);

  const isOver = hasTarget && rawRatio > 100;
  const isDanger = hasTarget && rawRatio >= 85;
  const isWarning = hasTarget && rawRatio >= 50 && rawRatio < 85;

  const progressColor = isOver || isDanger ? "error" : isWarning ? "warning" : "primary";
  const borderColor = isOver || isDanger ? "error.main" : isWarning ? "warning.main" : "primary.main";

  const statusLabel = isOver ? "초과" : isDanger ? "위험" : isWarning ? "주의" : "양호";
  const statusColor = isOver || isDanger ? "error" : isWarning ? "warning" : "success";

  const remainingDays = getRemainingDays();
  const dailyBudget =
    hasTarget && !isOver && remainingDays > 0
      ? Math.floor(remaining / remainingDays)
      : null;

  const spendingColor = hasTarget ? getSpendingColor(rawRatio) : "text.primary";

  return (
    <Card sx={{ height: "100%", borderRadius: 3, borderLeft: 4, borderColor }}>
      <CardContent
        sx={{
          p: 3,
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* 헤더 */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
              {month}월 예산 관리 현황
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
          {hasTarget && (
            <Button size="small" variant="text" sx={{ minWidth: 0, p: 0 }} onClick={onSetTarget}>
              수정
            </Button>
          )}
        </Box>

        {hasTarget ? (
          <>
            {/* 예산 / 지출 */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2}>
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  예산
                </Typography>
                <Typography variant="h3" fontWeight={700} color="primary.main" lineHeight={1}>
                  ₩{targetAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  이번 달 지출
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  lineHeight={1}
                  color={spendingColor}
                  sx={{ transition: "color 0.3s ease" }}
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

            {/* 하단 통계 3칸 */}
            <Divider sx={{ mb: 2.5 }} />
            <Box display="flex" justifyContent="space-around" textAlign="center">
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.75}>
                  남은 일수
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {remainingDays}일
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.75}>
                  하루 가능 금액
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={dailyBudget !== null && dailyBudget < 0 ? "error.main" : "text.primary"}
                >
                  {dailyBudget !== null ? `₩${dailyBudget.toLocaleString()}` : "—"}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.75}>
                  사용률
                </Typography>
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
          <>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                이번 달 지출
              </Typography>
              <Typography variant="h3" fontWeight={700}>
                ₩{monthlyTotal.toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            <Box display="flex" justifyContent="space-around" textAlign="center" mb={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.75}>
                  남은 일수
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {remainingDays}일
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography variant="body2" color="text.secondary" mb={0.75}>
                  일 평균 지출
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {now.getDate() > 0
                    ? `₩${Math.floor(monthlyTotal / now.getDate()).toLocaleString()}`
                    : "—"}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" mb={2}>
              예산 목표를 설정하면 소비 현황을 한눈에 볼 수 있어요.
            </Typography>
            <Button variant="outlined" size="small" onClick={onSetTarget}>
              목표 설정하기
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SummarySection;
