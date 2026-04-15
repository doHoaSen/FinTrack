import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MovieIcon from "@mui/icons-material/Movie";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import CategoryIcon from "@mui/icons-material/Category";
import type { SvgIconComponent } from "@mui/icons-material";
import type { Expense } from "../../store/expenseStore";

type CategoryMeta = {
  icon: SvgIconComponent;
  color: string;
  bg: string;
};

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  식비:    { icon: RestaurantIcon,    color: "#e65100", bg: "#fff3e0" },
  교통:    { icon: DirectionsBusIcon, color: "#1565c0", bg: "#e3f2fd" },
  쇼핑:    { icon: ShoppingBagIcon,   color: "#6a1b9a", bg: "#f3e5f5" },
  의료:    { icon: LocalHospitalIcon, color: "#c62828", bg: "#ffebee" },
  건강:    { icon: LocalHospitalIcon, color: "#c62828", bg: "#ffebee" },
  문화:    { icon: MovieIcon,         color: "#00695c", bg: "#e0f2f1" },
  여가:    { icon: MovieIcon,         color: "#00695c", bg: "#e0f2f1" },
  주거:    { icon: HomeIcon,          color: "#4e342e", bg: "#efebe9" },
  교육:    { icon: SchoolIcon,        color: "#283593", bg: "#e8eaf6" },
  카페:    { icon: LocalCafeIcon,     color: "#f57f17", bg: "#fffde7" },
};

const DEFAULT_META: CategoryMeta = {
  icon: CategoryIcon,
  color: "#546e7a",
  bg: "#eceff1",
};

function getCategoryMeta(categoryName: string): CategoryMeta {
  for (const key of Object.keys(CATEGORY_MAP)) {
    if (categoryName.includes(key)) return CATEGORY_MAP[key];
  }
  return DEFAULT_META;
}

function formatExpenseAt(expenseAt: string | null): string {
  if (!expenseAt) return "";

  const date = new Date(expenseAt);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const hhmm = date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });

  if (isSameDay(date, now)) return `오늘 ${hhmm}`;
  if (isSameDay(date, yesterday)) return `어제 ${hhmm}`;

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 6) return `${diffDays}일 전 ${hhmm}`;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

type Props = {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
  onEditExpense: (expense: Expense) => void;
  onMore: () => void;
};

function RecentExpenseSection({ expenses, onDeleteExpense, onEditExpense, onMore }: Props) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            최근 지출
          </Typography>
          <Button size="small" variant="text" onClick={onMore} sx={{ minWidth: 0 }}>
            더보기 →
          </Button>
        </Box>

        {expenses.length === 0 ? (
          <Typography variant="body2" color="text.disabled" textAlign="center" py={3}>
            이번 달 최근 지출이 없습니다.
          </Typography>
        ) : (
          <Box>
            {expenses.map((e, idx) => {
              const meta = getCategoryMeta(e.categoryName ?? "");
              const Icon = meta.icon;
              const label = e.memo?.trim() || e.categoryName || "기타";
              const dateStr = formatExpenseAt(e.expenseAt);
              const amountText =
                typeof e.amount === "number"
                  ? `${e.amount.toLocaleString()}원`
                  : "-";

              return (
                <Box key={`${e.id}-${e.expenseAt}`}>
                  {idx > 0 && <Divider sx={{ my: 0.5 }} />}
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    py={1}
                    sx={{
                      "&:hover .expense-actions": { opacity: 1 },
                    }}
                  >
                    {/* 카테고리 아이콘 */}
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: meta.bg,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 20, color: meta.color }} />
                    </Avatar>

                    {/* 상호명 + 날짜 */}
                    <Box flex={1} minWidth={0}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        title={label}
                      >
                        {label}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {dateStr}
                      </Typography>
                    </Box>

                    {/* 금액 */}
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="text.primary"
                      sx={{ flexShrink: 0 }}
                    >
                      {amountText}
                    </Typography>

                    {/* 수정/삭제 버튼 */}
                    <Box
                      className="expense-actions"
                      display="flex"
                      sx={{ opacity: 0, transition: "opacity 0.15s", flexShrink: 0 }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onEditExpense(e)}
                        sx={{ color: "text.disabled" }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDeleteExpense(e.id)}
                        sx={{ color: "text.disabled" }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentExpenseSection;
