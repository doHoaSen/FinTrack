import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Select,
  MenuItem,
  Pagination,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getExpenseApi } from "../features/expense/api";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import { useExpenseStore } from "../store/expenseStore";
import type { Expense } from "../store/expenseStore";
import { useDashboardStore } from "../store/dashboardStore";

function ExpensesPage() {
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  
  const joinedYear = useDashboardStore((s) => s.joinedYear);
  const fetchDashboard = useDashboardStore((s) => s.fetchDashboard);

  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month() + 1);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /** 지출 조회 */
  const fetchExpenses = async () => {
    const res = await getExpenseApi({
      year,
      month,
      page,
      size: 20,
    });

    setExpenses(res.content);
    setTotalPages(res.totalPages);
  };

  /** Dashboard 메타 데이터 보장 */
  useEffect(() => {
    if (joinedYear === null) {
      fetchDashboard();
    }
  }, []);

  /** 핵심: 조건 바뀌면 조회 */
  useEffect(() => {
    if (joinedYear !== null) {
      fetchExpenses();
    }
  }, [joinedYear, year, month, page]);

  const currentYear = dayjs().year();
  const years =
    joinedYear !== null
      ? Array.from(
          { length: currentYear - joinedYear + 1 },
          (_, i) => joinedYear + i
        )
      : [];

  /** 삭제 */
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteExpense(id);
    fetchExpenses();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        지출 관리
      </Typography>

      {/* 필터 */}
      <Stack direction="row" spacing={2} mb={3}>
        <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {years.map((y) => (
            <MenuItem key={y} value={y}>
              {y}년
            </MenuItem>
          ))}
        </Select>

        <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }).map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}월
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {/* 테이블 */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>날짜</TableCell>
            <TableCell>카테고리</TableCell>
            <TableCell>유형</TableCell>
            <TableCell align="right">금액</TableCell>
            <TableCell align="center">관리</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {expenses.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                {e.expenseAt
                  ? dayjs(e.expenseAt).format("YYYY-MM-DD HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>{e.categoryName}</TableCell>
              <TableCell>
                {e.categoryType === "FIXED" ? "고정비" : "변동비"}
              </TableCell>
              <TableCell align="right">
                {e.amount.toLocaleString()}원
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => setEditingExpense(e)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(e.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {expenses.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                지출 내역이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 페이지네이션 */}
      <Stack alignItems="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, v) => setPage(v - 1)}
        />
      </Stack>

      {/* 수정 모달 */}
      {editingExpense && (
        <QuickExpenseForm
          mode="edit"
          initialExpense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={(updated) => {
              setRecentExpenses(prev =>
                prev.map(e => e.id === updated.id ? updated : e)
              );
              setEditingExpense(null);
            }}
        />
      )}
    </Box>
  );
}

export default ExpensesPage;
