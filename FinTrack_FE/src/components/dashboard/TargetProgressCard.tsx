import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Button,
  Chip,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import type { TargetResponse } from "../../features/dashboard/api";

type Props = {
  target: TargetResponse | null;
  onSetTarget: () => void;
};

function TargetProgressCard({ target, onSetTarget }: Props) {
  if (!target || !target.exists) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <TrackChangesIcon color="action" />
            <Typography variant="subtitle1" fontWeight={600}>
              이번 달 절약 목표
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            아직 이번 달 목표가 설정되지 않았어요.
          </Typography>
          <Button variant="outlined" size="small" onClick={onSetTarget}>
            목표 설정하기
          </Button>
        </CardContent>
      </Card>
    );
  }

  const ratio = Math.min(target.ratio, 100);
  const isOver = target.ratio > 100;
  const isDanger = target.ratio >= 80;

  const progressColor = isOver ? "error" : isDanger ? "warning" : "primary";

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <TrackChangesIcon color={isOver ? "error" : "primary"} />
            <Typography variant="subtitle1" fontWeight={600}>
              이번 달 절약 목표
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            {isOver && <Chip label="목표 초과" color="error" size="small" />}
            {!isOver && isDanger && <Chip label="주의" color="warning" size="small" />}
            {!isOver && !isDanger && <Chip label="양호" color="primary" size="small" variant="outlined" />}
            <Button size="small" variant="text" onClick={onSetTarget}>
              수정
            </Button>
          </Box>
        </Box>

        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" color="text.secondary">
              사용 {target.usedAmount.toLocaleString()}원
            </Typography>
            <Typography variant="body2" color="text.secondary">
              목표 {target.targetAmount?.toLocaleString()}원
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={ratio}
            color={progressColor}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
            {target.ratio.toFixed(1)}% 사용
          </Typography>
        </Box>

        {target.message && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {target.message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default TargetProgressCard;
