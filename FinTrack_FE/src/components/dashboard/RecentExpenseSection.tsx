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
import { getCategoryColor } from "../../utils/categoryColor";

// 아이콘 모양은 이름 키워드로 매칭, 색상은 카테고리별 커스터마이징 값(getCategoryColor)을 그대로 사용
const ICON_SHAPE_MAP: { keywords: string[]; icon: SvgIconComponent }[] = [
  { keywords: ["식비"], icon: RestaurantIcon },
  { keywords: ["교통"], icon: DirectionsBusIcon },
  { keywords: ["쇼핑"], icon: ShoppingBagIcon },
  { keywords: ["의료", "건강"], icon: LocalHospitalIcon },
  { keywords: ["문화", "여가"], icon: MovieIcon },
  { keywords: ["주거"], icon: HomeIcon },
  { keywords: ["교육"], icon: SchoolIcon },
  { keywords: ["카페"], icon: LocalCafeIcon },
];

function getCategoryIcon(categoryName: string): SvgIconComponent {
  return (
    ICON_SHAPE_MAP.find(({ keywords }) => keywords.some((k) => categoryName.includes(k)))?.icon ??
    CategoryIcon
  );
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

  // 시간이 아닌 캘린더 날짜 기준으로 차이 계산 (밀리초 오차 방지)
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const expDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((nowDate.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));
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

const MAX_DISPLAY = 5;

function RecentExpenseSection({ expenses, onDeleteExpense, onEditExpense, onMore }: Props) {
  const displayed = expenses.slice(0, MAX_DISPLAY);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3,}}>
      <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* 헤더 */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexShrink={0}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            최근 지출
          </Typography>
          <Button size="small" variant="text" onClick={onMore} sx={{ minWidth: 0 }}>
            더보기 →
          </Button>
        </Box>

        {displayed.length === 0 ? (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body2" color="text.disabled">
              이번 달 최근 지출이 없습니다.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {displayed.map((e, idx) => {
              const Icon = getCategoryIcon(e.categoryName ?? "");
              const color = getCategoryColor(e.categoryId);
              const bg = `${color}1a`;
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
                        bgcolor: bg,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 20, color }} />
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
