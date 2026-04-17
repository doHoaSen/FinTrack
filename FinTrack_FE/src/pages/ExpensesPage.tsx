import React from "react";
import {
  Box,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Button,
  LinearProgress,
  FormControl,
  InputLabel,
  Paper,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getExpenseApi } from "../features/expense/api";
import { getCategoriesApi } from "../features/category/api";
import { getTargetApi } from "../features/target/api";
import QuickExpenseForm from "../components/dashboard/QuickExpenseForm";
import { useExpenseStore } from "../store/expenseStore";
import type { Expense } from "../store/expenseStore";
import { useDashboardStore } from "../store/dashboardStore";
import type { Category } from "../features/category/type";
import type { TargetResponse } from "../features/dashboard/api";

const PAGE_SIZE = 10;

function ExpensesPage() {
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const joinedYear = useDashboardStore((s) => s.joinedYear);
  const fetchDashboard = useDashboardStore((s) => s.fetchDashboard);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [target, setTarget] = useState<TargetResponse | null>(null);

  // 필터 입력 (pending)
  const [filterYear, setFilterYear] = useState(dayjs().year());
  const [filterMonth, setFilterMonth] = useState(dayjs().month() + 1);
  const [filterCategoryId, setFilterCategoryId] = useState<number | "">("");
  const [filterType, setFilterType] = useState<"FIXED" | "VARIABLE" | "">("");

  // 적용된 필터 (실제 API 호출용)
  const [appliedYear, setAppliedYear] = useState(dayjs().year());
  const [appliedMonth, setAppliedMonth] = useState(dayjs().month() + 1);
  const [appliedCategoryId, setAppliedCategoryId] = useState<number | "">("");
  const [appliedType, setAppliedType] = useState<"FIXED" | "VARIABLE" | "">("");

  useEffect(() => {
    if (joinedYear === null) fetchDashboard();
    getCategoriesApi().then(setCategories);
  }, []);

  // 테이블: 페이지·필터 변경 시 재조회
  useEffect(() => {
    if (joinedYear === null) return;
    fetchExpenses();
  }, [joinedYear, appliedYear, appliedMonth, appliedCategoryId, appliedType, page]);

  // 하단 카드: 연/월 변경 시에만 재조회 (필터 무관)
  useEffect(() => {
    if (joinedYear === null) return;
    fetchMonthlyTotal();
    fetchTarget();
  }, [joinedYear, appliedYear, appliedMonth]);

  const fetchExpenses = async () => {
    const res = await getExpenseApi({
      year: appliedYear,
      month: appliedMonth,
      page,
      size: PAGE_SIZE,
      ...(appliedCategoryId !== "" && { categoryId: appliedCategoryId as number }),
      ...(appliedType !== "" && { type: appliedType as "FIXED" | "VARIABLE" }),
    });
    setExpenses(res.content);
    setTotalPages(res.totalPages);
    setTotalElements(res.totalElements);
  };

  // 해당 월 전체 지출 합산 (카테고리/유형 필터 미적용)
  const fetchMonthlyTotal = async () => {
    const res = await getExpenseApi({
      year: appliedYear,
      month: appliedMonth,
      page: 0,
      size: 10000,
    });
    const total = (res.content as Expense[]).reduce((sum, e) => sum + e.amount, 0);
    setMonthlyTotal(total);
  };

  const fetchTarget = async () => {
    try {
      const t = await getTargetApi();
      if (t.exists && t.year === appliedYear && t.month === appliedMonth) {
        setTarget(t);
      } else {
        setTarget(null);
      }
    } catch {
      setTarget(null);
    }
  };

  const handleApplyFilter = () => {
    setAppliedYear(filterYear);
    setAppliedMonth(filterMonth);
    setAppliedCategoryId(filterCategoryId);
    setAppliedType(filterType);
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteExpense(id);
    fetchExpenses();
    fetchMonthlyTotal();
  };

  const currentYear = dayjs().year();
  const years =
    joinedYear !== null
      ? Array.from({ length: currentYear - joinedYear + 1 }, (_, i) => joinedYear + i)
      : [currentYear];

  const formatTime = (expenseAt: string | null) => {
    if (!expenseAt) return "-";
    const dt = dayjs(expenseAt);
    const hour = dt.hour();
    const ampm = hour < 12 ? "오전" : "오후";
    const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${ampm} ${h}:${dt.format("mm")}`;
  };

  const formatGroupDate = (dateKey: string) => {
    const dt = dayjs(dateKey);
    return `${dt.month() + 1}월 ${dt.date()}일`;
  };

  // 현재 페이지 데이터를 날짜(YYYY-MM-DD)별로 그룹화
  const groupedExpenses = expenses.reduce<{ dateKey: string; items: Expense[] }[]>(
    (acc, item) => {
      const dateKey = item.expenseAt ? item.expenseAt.split("T")[0] : "unknown";
      const group = acc.find((g) => g.dateKey === dateKey);
      if (group) {
        group.items.push(item);
      } else {
        acc.push({ dateKey, items: [item] });
      }
      return acc;
    },
    []
  );

  const getTargetCardMessage = () => {
    if (!target) {
      const isCurrentMonth =
        appliedYear === dayjs().year() && appliedMonth === dayjs().month() + 1;
      return isCurrentMonth
        ? "이번 달 지출을 기록하고 있어요."
        : `${appliedMonth}월 지출 내역이에요.`;
    }
    const remaining = (target.targetAmount ?? 0) - monthlyTotal;
    if (remaining >= 0) {
      return `현재 목표 예산에서 ${remaining.toLocaleString()}원 남았어요!`;
    }
    return `목표 예산에서 ${Math.abs(remaining).toLocaleString()}원 초과했어요.`;
  };

  const progressRatio =
    target?.targetAmount != null && target.targetAmount > 0
      ? Math.min((monthlyTotal / target.targetAmount) * 100, 100)
      : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* 헤더 */}
      <Typography variant="h5" fontWeight={700} mb={0.5}>
        지출 내역
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2.5}>
        
      </Typography>

      {/* 필터 한 줄 */}
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" mb={3}>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel>연도</InputLabel>
          <Select
            value={filterYear}
            label="연도"
            onChange={(e) => setFilterYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}년
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>월</InputLabel>
          <Select
            value={filterMonth}
            label="월"
            onChange={(e) => setFilterMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}월
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={filterCategoryId}
            label="카테고리"
            onChange={(e) => setFilterCategoryId(e.target.value as number | "")}
          >
            <MenuItem value="">전체</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>유형</InputLabel>
          <Select
            value={filterType}
            label="유형"
            onChange={(e) =>
              setFilterType(e.target.value as "FIXED" | "VARIABLE" | "")
            }
          >
            <MenuItem value="">전체</MenuItem>
            <MenuItem value="FIXED">고정비</MenuItem>
            <MenuItem value="VARIABLE">변동비</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleApplyFilter}
          disableElevation
          sx={{ borderRadius: 2, fontWeight: 600, height: 40, px: 2.5 }}
        >
          필터 적용
        </Button>
      </Stack>

      {/* 월 요약 */}
      <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1.5}>
        {appliedYear}년 {appliedMonth}월 (총 {totalElements}건)
      </Typography>

      {/* 테이블 카드 */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Table>
          <TableBody>
            {groupedExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  지출 내역이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              groupedExpenses.map(({ dateKey, items }) => (
                <React.Fragment key={dateKey}>
                  {/* 날짜 구분 헤더 */}
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{
                        bgcolor: "grey.50",
                        py: 0.75,
                        px: 2,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "text.secondary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {formatGroupDate(dateKey)}
                    </TableCell>
                  </TableRow>

                  {/* 해당 날짜의 지출 행 */}
                  {items.map((e) => (
                    <TableRow
                      key={e.id}
                      sx={{
                        height: 52,
                        "&:hover": { bgcolor: "grey.50" },
                        transition: "background 0.15s",
                      }}
                    >
                      <TableCell sx={{ py: 1, px: 2, width: 90 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(e.expenseAt)}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1, px: 2 }}>
                        <Typography variant="body2">{e.categoryName}</Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1, px: 2 }}>
                        <Chip
                          label={e.categoryType === "FIXED" ? "고정비" : "변동비"}
                          size="small"
                          sx={{
                            fontSize: 11,
                            height: 20,
                            fontWeight: 500,
                            ...(e.categoryType === "FIXED"
                              ? { bgcolor: "#E8F5E9", color: "#2E7D32" }
                              : { bgcolor: "#EEF2FF", color: "#3B5BDB" }),
                          }}
                        />
                      </TableCell>

                      <TableCell align="right" sx={{ py: 1, px: 2 }}>
                        <Typography variant="body2" fontWeight={700}>
                          ₩{e.amount.toLocaleString()}
                        </Typography>
                      </TableCell>

                      <TableCell align="center" sx={{ py: 1, px: 1 }}>
                        <IconButton size="small" onClick={() => setEditingExpense(e)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(e.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        <Stack
          alignItems="center"
          sx={{ py: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, v) => setPage(v - 1)}
            shape="rounded"
            size="small"
          />
        </Stack>
      </Paper>

      {/* 이번 달 지출 목표 카드 */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3B5BDB 0%, #4C6EF5 100%)",
          borderRadius: 3,
          p: 3,
          color: "white",
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
          {appliedMonth}월 지출 {target ? "목표" : "합계"}
        </Typography>

        <Box display="flex" alignItems="baseline" gap={1} mb={target?.targetAmount != null ? 1.5 : 1}>
          <Typography variant="h4" fontWeight={700}>
            ₩{monthlyTotal.toLocaleString()}
          </Typography>
          {target?.targetAmount != null && (
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              / ₩{target.targetAmount.toLocaleString()}
            </Typography>
          )}
        </Box>

        {target?.targetAmount != null && (
          <Box mb={1.5}>
            <LinearProgress
              variant="determinate"
              value={progressRatio}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.25)",
                "& .MuiLinearProgress-bar": {
                  bgcolor:
                    progressRatio >= 100
                      ? "#FF6B6B"
                      : "#69DB7C",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}

        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {getTargetCardMessage()}
        </Typography>
      </Box>

      {/* 수정 모달 */}
      {editingExpense && (
        <QuickExpenseForm
          mode="edit"
          initialExpense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => {
            setEditingExpense(null);
            fetchExpenses();
            fetchMonthlyTotal();
          }}
        />
      )}
    </Box>
  );
}

export default ExpensesPage;
