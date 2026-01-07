import { useEffect, useState } from "react";
import { useExpenseStore } from "../../store/expenseStore";
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
} from "@mui/material";

function QuickExpenseForm() {
  const addExpense = useExpenseStore((s) => s.addExpense);
  const { categories, fetchCategories, addCategory } = useCategoryStore();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dateTime, setDateTime] = useState(dayjs());
  const [memo, setMemo] = useState("");

  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"FIXED" | "VARIABLE">("VARIABLE");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !categoryId) return;

    await addExpense({
      amount: Number(amount),
      categoryId,
      memo,
      expenseAt: dateTime.toISOString(),
    });

    setAmount("");
    setMemo("");
  };

  const handleAddCategory = async () => {
    await addCategory({ name: newName, type: newType });
    setOpen(false);
    setNewName("");
  };

  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#fafafa" }}>
      <Typography fontWeight={600} mb={2}>
        빠른 지출 등록
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
        value={categoryId ?? ""}
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
        등록하기
      </Button>

      {/* 카테고리 추가 다이얼로그 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>카테고리 추가</DialogTitle>
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
}

export default QuickExpenseForm;
