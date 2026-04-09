import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { TargetResponse } from "../../features/dashboard/api";
import { createTargetApi, updateTargetApi, deleteTargetApi } from "../../features/target/api";

type Props = {
  open: boolean;
  target: TargetResponse | null;
  onClose: () => void;
  onSuccess: () => void;
};

function TargetSettingDialog({ open, target, onClose, onSuccess }: Props) {
  const hasTarget = target?.exists ?? false;
  const [amount, setAmount] = useState(
    hasTarget && target?.targetAmount ? String(target.targetAmount) : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setAmount(hasTarget && target?.targetAmount ? String(target.targetAmount) : "");
    setError("");
  };

  const validate = () => {
    const num = Number(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError("올바른 금액을 입력해 주세요.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (hasTarget) {
        await updateTargetApi(Number(amount));
      } else {
        await createTargetApi(Number(amount));
      }
      onSuccess();
      onClose();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTargetApi();
      onSuccess();
      onClose();
    } catch {
      setError("삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} onTransitionEnter={handleOpen} maxWidth="xs" fullWidth>
      <DialogTitle>{hasTarget ? "목표 수정" : "이번 달 목표 설정"}</DialogTitle>
      <DialogContent>
        <Box pt={1}>
          {hasTarget && target?.targetAmount && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              현재 목표: {target.targetAmount.toLocaleString()}원
            </Typography>
          )}
          <TextField
            label="목표 금액 (원)"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
            fullWidth
            autoFocus
            inputProps={{ min: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        <Box>
          {hasTarget && (
            <Button color="error" onClick={handleDelete} disabled={loading}>
              삭제
            </Button>
          )}
        </Box>
        <Box display="flex" gap={1}>
          <Button onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            저장
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default TargetSettingDialog;
