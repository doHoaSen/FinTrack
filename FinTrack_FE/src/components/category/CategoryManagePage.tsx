import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CategoryIcon from "@mui/icons-material/Category";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MovieIcon from "@mui/icons-material/Movie";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SecurityIcon from "@mui/icons-material/Security";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SchoolIcon from "@mui/icons-material/School";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import type { SvgIconComponent } from "@mui/icons-material";
import dayjs from "dayjs";

import { getCategoriesApi } from "../../features/category/api";
import { getExpenseApi } from "../../features/expense/api";
import { useCategoryStore } from "../../store/categoryStore";
import CategoryEditDialog from "./CategoryEditDialog";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import CategoryDetailDialog from "./CategoryDetailDialog";
import type { Category } from "../../features/category/type";

type IconMeta = { icon: SvgIconComponent; color: string; bg: string };

const ICON_MAP: { keywords: string[]; meta: IconMeta }[] = [
  { keywords: ["식", "음식", "밥"], meta: { icon: RestaurantIcon, color: "#e65100", bg: "#fff3e0" } },
  { keywords: ["주거", "통신", "월세", "관리비"], meta: { icon: HomeIcon, color: "#4e342e", bg: "#efebe9" } },
  { keywords: ["교통", "차량", "자동차", "주유"], meta: { icon: DirectionsCarIcon, color: "#1565c0", bg: "#e3f2fd" } },
  { keywords: ["문화", "여가", "영화", "취미"], meta: { icon: MovieIcon, color: "#00695c", bg: "#e0f2f1" } },
  { keywords: ["의료", "건강", "병원", "약"], meta: { icon: LocalHospitalIcon, color: "#c62828", bg: "#ffebee" } },
  { keywords: ["보험"], meta: { icon: SecurityIcon, color: "#37474f", bg: "#eceff1" } },
  { keywords: ["쇼핑"], meta: { icon: ShoppingBagIcon, color: "#6a1b9a", bg: "#f3e5f5" } },
  { keywords: ["교육", "학습"], meta: { icon: SchoolIcon, color: "#283593", bg: "#e8eaf6" } },
  { keywords: ["카페", "커피"], meta: { icon: LocalCafeIcon, color: "#f57f17", bg: "#fffde7" } },
];

const DEFAULT_META: IconMeta = { icon: CategoryIcon, color: "#546e7a", bg: "#eceff1" };

function getIconMeta(name: string): IconMeta {
  for (const { keywords, meta } of ICON_MAP) {
    if (keywords.some((k) => name.includes(k))) return meta;
  }
  return DEFAULT_META;
}

const FILTER_OPTIONS = [
  { value: "" as const, label: "전체" },
  { value: "FIXED" as const, label: "고정비" },
  { value: "VARIABLE" as const, label: "변동비" },
];

function CategoryManagePage() {
  const { addCategory } = useCategoryStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [countMap, setCountMap] = useState<Record<number, number>>({});
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"" | "FIXED" | "VARIABLE">("");

  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"FIXED" | "VARIABLE">("VARIABLE");

  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [detailTarget, setDetailTarget] = useState<Category | null>(null);

  const fetchCategories = async () => {
    const data = await getCategoriesApi();
    setCategories(data);
  };

  const fetchMonthlyCounts = async () => {
    const year = dayjs().year();
    const month = dayjs().month() + 1;
    const res = await getExpenseApi({ year, month, page: 0, size: 1000 });
    const map: Record<number, number> = {};
    (res.content as { categoryId: number }[]).forEach((e) => {
      map[e.categoryId] = (map[e.categoryId] ?? 0) + 1;
    });
    setCountMap(map);
  };

  useEffect(() => {
    fetchCategories();
    fetchMonthlyCounts();
  }, []);

  const handleAddCategory = async () => {
    if (!newName) return;
    await addCategory({ name: newName, type: newType });
    setAddOpen(false);
    setNewName("");
    setNewType("VARIABLE");
    fetchCategories();
  };

  const variableCount = categories.filter((c) => c.type === "VARIABLE").length;
  const fixedCount = categories.filter((c) => c.type === "FIXED").length;
  const total = categories.length;

  const filtered = categories.filter((c) => {
    const matchSearch = c.name.includes(search);
    const matchType = filterType === "" || c.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <Box>
      {/* 헤더 */}
      <Typography variant="caption" color="text.disabled" display="block" mb={0.5}>
        설정
      </Typography>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={0.5}>
            카테고리 관리
          </Typography>
          <Typography variant="body2" color="text.secondary">
            지출을 그룹화하고 카테고리를 맞춤 설정하여 금융 데이터를 정리하세요.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          disableElevation
          sx={{ borderRadius: 3, fontWeight: 600, px: 2.5, py: 1.2, whiteSpace: "nowrap", flexShrink: 0 }}
        >
          새 카테고리
        </Button>
      </Box>

      {/* 본문 2열 */}
      <Grid container spacing={3} alignItems="flex-start">
        {/* 왼쪽: 현황 카드 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: "#EEF2FF", mb: 2.5 }}>
                <CategoryIcon sx={{ color: "#3B5BDB", fontSize: 28 }} />
              </Avatar>

              <Typography variant="h6" fontWeight={700} mb={1}>
                카테고리 현황
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3} lineHeight={1.8}>
                현재{" "}
                <Box component="span" fontWeight={700} color="primary.main">
                  {total}개의 카테고리
                </Box>
                가 있습니다. 명확한 분류는 더 나은 인사이트를 제공하는 데 도움이 됩니다.
              </Typography>

              <Stack spacing={1.5}>
                {[
                  {
                    type: "VARIABLE" as const,
                    label: "변동비",
                    count: variableCount,
                    trackColor: "#EEF2FF",
                    barColor: "#3B5BDB",
                  },
                  {
                    type: "FIXED" as const,
                    label: "고정비",
                    count: fixedCount,
                    trackColor: "#E8F5E9",
                    barColor: "#2E7D32",
                  },
                ].map(({ type, label, count, trackColor, barColor }) => {
                  const isActive = filterType === type;
                  return (
                    <Box
                      key={type}
                      onClick={() => setFilterType(isActive ? "" : type)}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        cursor: "pointer",
                        border: "1.5px solid",
                        borderColor: isActive ? barColor : "transparent",
                        bgcolor: isActive ? trackColor : "transparent",
                        transition: "all 0.15s",
                        "&:hover": { bgcolor: trackColor },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" mb={0.75}>
                        <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
                          {label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {count}개 카테고리
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={total > 0 ? (count / total) * 100 : 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: isActive ? "rgba(255,255,255,0.6)" : trackColor,
                          "& .MuiLinearProgress-bar": { bgcolor: barColor, borderRadius: 4 },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 오른쪽: 검색 + 카드 목록 */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
            <TextField
              size="small"
              placeholder="카테고리 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              }}
            />
            {FILTER_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                size="small"
                variant={filterType === value ? "contained" : "outlined"}
                onClick={() => setFilterType(value)}
                disableElevation
                sx={{
                  borderRadius: 5,
                  fontWeight: 600,
                  px: 2,
                  minWidth: 0,
                  borderColor: "divider",
                  color: filterType === value ? "white" : "text.secondary",
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Stack spacing={1.5}>
            {filtered.map((c) => {
              const meta = getIconMeta(c.name);
              const Icon = meta.icon;
              const count = countMap[c.id] ?? 0;

              return (
                <Card
                  key={c.id}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "box-shadow 0.15s",
                    "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.07)" },
                    "&:hover .cat-actions": { opacity: 1 },
                  }}
                  onClick={() => setDetailTarget(c)}
                >
                  <CardContent sx={{ py: 1.75, px: 2.5, "&:last-child": { pb: 1.75 } }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 44, height: 44, bgcolor: meta.bg, flexShrink: 0 }}>
                        <Icon sx={{ fontSize: 22, color: meta.color }} />
                      </Avatar>

                      <Box flex={1} minWidth={0}>
                        <Typography variant="body1" fontWeight={600}>
                          {c.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.3}>
                          <Chip
                            label={c.type === "FIXED" ? "고정비" : "변동비"}
                            size="small"
                            sx={{
                              fontSize: 11,
                              height: 20,
                              fontWeight: 600,
                              ...(c.type === "FIXED"
                                ? { bgcolor: "#EEF2FF", color: "#3B5BDB" }
                                : { bgcolor: "#FEF3C7", color: "#D97706" }),
                            }}
                          />
                          <Typography variant="caption" color="text.disabled">
                            이번 달 {count}건의 거래
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        className="cat-actions"
                        display="flex"
                        gap={0.5}
                        sx={{ opacity: 0, transition: "opacity 0.15s", flexShrink: 0 }}
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "text.disabled" }}
                          onClick={(e) => { e.stopPropagation(); setEditTarget(c); }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "text.disabled" }}
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 && (
              <Box py={6} textAlign="center">
                <Typography variant="body2" color="text.disabled">
                  카테고리가 없습니다.
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* 새 카테고리 다이얼로그 */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, pb: 1 }}>새 카테고리</DialogTitle>
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

      {detailTarget && (
        <CategoryDetailDialog
          category={detailTarget}
          meta={getIconMeta(detailTarget.name)}
          onClose={() => setDetailTarget(null)}
          onEdit={() => { setDetailTarget(null); setEditTarget(detailTarget); }}
          onDelete={() => { setDetailTarget(null); setDeleteTarget(detailTarget); }}
        />
      )}

      {editTarget && (
        <CategoryEditDialog
          category={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchCategories}
        />
      )}

      {deleteTarget && (
        <CategoryDeleteDialog
          category={deleteTarget}
          categories={categories}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchCategories}
        />
      )}
    </Box>
  );
}

export default CategoryManagePage;
