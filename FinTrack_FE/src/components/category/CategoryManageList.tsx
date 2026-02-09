import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Category } from "../../features/category/type";


type Props = {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
};


function CategoryManageList({ categories = [], onEdit, onDelete }: Props) {
  
    return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        카테고리 관리
      </Typography>

      <Stack spacing={2}>
        {categories.map((c) => (
          <Card
            key={c.id}
            sx={{
              p: 2,
              borderRadius: 2,
              transition: "0.15s",
              "&:hover": {
                boxShadow: 3,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* 왼쪽: 카테고리 정보 */}
              <Box>
                <Typography fontWeight={600}>
                  {c.name}
                </Typography>

                <Chip
                  size="small"
                  label={c.type === "FIXED" ? "고정비" : "변동비"}
                  sx={{ mt: 0.5 }}
                  color={c.type === "FIXED" ? "primary" : "default"}
                />
              </Box>

              {/* 오른쪽: 액션 */}
              <Box>
                <IconButton
                  size="small"
                  onClick={() => onEdit(c)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(c)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default CategoryManageList;
