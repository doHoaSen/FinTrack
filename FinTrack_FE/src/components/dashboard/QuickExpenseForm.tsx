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
  DialogContent,
} from "@mui/material";
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
  initialExpense?.expenseAt
    ? dayjs(initialExpense.expenseAt)
    : dayjs()
);
  const [memo, setMemo] = useState(initialExpense?.memo ?? "");

  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"FIXED" | "VARIABLE">("VARIABLE");

  useEffect(() => {
    fetchCategories();
  }, []);

 const handleSubmit = async () => {
  if (!amount || !categoryId) return;

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
    const created = await createExpenseApi(payload);

    // optimistic update용으로 부모에 전달
    onSuccess?.(created);

    // ✅ 폼 초기화
    setAmount("");
    setCategoryId("");
    setMemo("");
    setDateTime(dayjs());
  }
};

  /** 카테고리 추가 */
  const handleAddCategory = async () => {
    if (!newName) return;
    await addCategory({ name: newName, type: newType });
    setOpen(false);
    setNewName("");
  };

  const content = (
    <Box sx={{ p: 2 }}>
      <Typography fontWeight={600} mb={2}>
        {isEdit ? "지출 수정" : "빠른 지출 등록"}
      </Typography>

      <TextField
        label="금액"
        type="number"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        select
        label="카테고리"
        fullWidth
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        sx={{ mb: 1 }}
      >
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name} {c.type === "FIXED" && "(고정)"}
          </MenuItem>
        ))}
      </TextField>

      <Button size="small" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        + 카테고리 추가
      </Button>

      <TextField
        type="datetime-local"
        label="지출 시간"
        fullWidth
        value={dateTime.format("YYYY-MM-DDTHH:mm")}
        onChange={(e) => setDateTime(dayjs(e.target.value))}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />

      <TextField
        label="메모 (선택)"
        fullWidth
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button fullWidth variant="contained" onClick={handleSubmit}>
        {isEdit ? "수정 완료" : "등록하기"}
      </Button>

      {/* 카테고리 다이얼로그 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <TextField
            label="이름"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="유형"
            fullWidth
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
          >
            <MenuItem value="FIXED">고정비</MenuItem>
            <MenuItem value="VARIABLE">변동비</MenuItem>
          </TextField>

          <Button fullWidth sx={{ mt: 2 }} onClick={handleAddCategory}>
            저장
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );

  if (isEdit) {
    return (
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>{content}</DialogContent>
      </Dialog>
    );
  }

  return <Box sx={{ borderRadius: 2, bgcolor: "#fafafa" }}>{content}</Box>;
}

export default QuickExpenseForm;
