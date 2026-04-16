import { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/categoryStore";
import dayjs from "dayjs";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import { createExpenseApi, updateExpenseApi } from "../../features/expense/api";
import type { Expense } from "../../store/expenseStore";

type Props = {
  mode?: "create" | "edit";
  initialExpense?: Expense;
  onClose?: () => void;
  onSuccess?: (updated?: any) => void;
};

function QuickExpenseForm({
  mode = "create",
  initialExpense,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = mode === "edit";
  const { categories, fetchCategories, addCategory } = useCategoryStore();

  const [amount, setAmount] = useState(
    initialExpense?.amount?.toString() ?? ""
  );
  const [categoryId, setCategoryId] = useState<number | "">(
    initialExpense?.categoryId ?? ""
  );
  const [dateTime, setDateTime] = useState(
    initialExpense?.expenseAt ? dayjs(initialExpense.expenseAt) : dayjs()
  );
  const [memo, setMemo] = useState(initialExpense?.memo ?? "");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"FIXED" | "VARIABLE">("VARIABLE");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !categoryId || loading) return;
    setLoading(true);

    try {
      const payload = {
        amount: Number(amount),
        categoryId,
        memo,
        expenseAt: dateTime.format("YYYY-MM-DDTHH:mm"),
      };

      if (isEdit && initialExpense) {
        const updated = await updateExpenseApi(initialExpense.id, payload);
        onSuccess?.(updated);
      } else {
        const createdId = await createExpenseApi(payload);

        const selectedCategory = categories.find((c) => c.id === categoryId);
        const newExpense: Expense = {
          id: createdId,
          amount: Number(amount),
          categoryId: categoryId as number,
          categoryName: selectedCategory?.name ?? "",
          categoryType: selectedCategory?.type ?? null,
          expenseAt: dateTime.format("YYYY-MM-DDTHH:mm"),
          memo: memo || undefined,
        };

        onSuccess?.(newExpense);

        setAmount("");
        setCategoryId("");
        setMemo("");
        setDateTime(dayjs());
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newName) return;
    await addCategory({ name: newName, type: newType });
    setOpen(false);
    setNewName("");
  };

  const isReady = Boolean(amount && categoryId);

  const content = (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
      {/* 헤더 */}
      <Box display="flex" alignItems="center" gap={0.75}>
        {isEdit
          ? <EditNoteIcon sx={{ fontSize: 18, color: "primary.main" }} />
          : <BoltIcon sx={{ fontSize: 18, color: "primary.main" }} />
        }
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
          {isEdit ? "지출 수정" : "빠른 지출 등록"}
        </Typography>
      </Box>

      {/* 금액 */}
      <TextField
        label="금액"
        type="number"
        size="small"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">₩</InputAdornment>,
        }}
      />

      {/* 카테고리 + 추가 버튼 */}
      <Box display="flex" gap={1} alignItems="flex-start">
        <TextField
          select
          label="카테고리"
          size="small"
          fullWidth
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
              {c.type === "FIXED" && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.disabled"
                  sx={{ ml: 0.5 }}
                >
                  고정
                </Typography>
              )}
            </MenuItem>
          ))}
        </TextField>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            minWidth: 0,
            px: 1.2,
            height: 40,
            flexShrink: 0,
            borderRadius: 2,
            borderColor: "divider",
            color: "text.secondary",
          }}
        >
          <AddIcon fontSize="small" />
        </Button>
      </Box>

      {/* 지출 시간 */}
      <TextField
        type="datetime-local"
        label="지출 시간"
        size="small"
        fullWidth
        value={dateTime.format("YYYY-MM-DDTHH:mm")}
        onChange={(e) => setDateTime(dayjs(e.target.value))}
        InputLabelProps={{ shrink: true }}
      />

      {/* 메모 */}
      <TextField
        label="메모 (선택)"
        size="small"
        fullWidth
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />

      {/* 등록 버튼 */}
      <Box>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !isReady}
          disableElevation
          sx={{ borderRadius: 2, py: 1.2, fontWeight: 600, fontSize: 14 }}
        >
          {loading
            ? <CircularProgress size={18} color="inherit" />
            : (isEdit ? "수정 완료" : "등록하기")
          }
        </Button>
      </Box>

      {/* 카테고리 추가 다이얼로그 */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 600, fontSize: 15 }}>
          카테고리 추가
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
          <TextField
            label="이름"
            size="small"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            select
            label="유형"
            size="small"
            fullWidth
            value={newType}
            onChange={(e) => setNewType(e.target.value as "FIXED" | "VARIABLE")}
          >
            <MenuItem value="VARIABLE">변동비</MenuItem>
            <MenuItem value="FIXED">고정비</MenuItem>
          </TextField>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            disabled={!newName}
            onClick={handleAddCategory}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            저장
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );

  if (isEdit) {
    return (
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 0 }} />
        <DialogContent sx={{ pt: "0 !important" }}>{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 0, height: "100%", "&:last-child": { pb: 0 } }}>
        {content}
      </CardContent>
    </Card>
  );
}

export default QuickExpenseForm;
