import { Dialog, DialogContent, Typography, Button, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import {
  deleteCategoryApi,
  replaceAndDeleteCategoryApi,
} from "../../features/category/api";
import type { Category } from "../../features/category/type";

type Props = {
  category: Category;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
};

function CategoryDeleteDialog({ category, categories, onClose, onSuccess }: Props) {
  const [targetId, setTargetId] = useState<number | "">("");

  const handleDelete = async () => {
    if (targetId) {
      await replaceAndDeleteCategoryApi(category.id, Number(targetId));
    } else {
      await deleteCategoryApi(category.id);
    }
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <Typography mb={2}>
          이 카테고리를 삭제하시겠습니까?
        </Typography>

        <Typography variant="caption">
          지출이 있다면 다른 카테고리로 변경해야 합니다.
        </Typography>

        <TextField
          select
          fullWidth
          value={targetId}
          onChange={(e) => setTargetId(Number(e.target.value))}
          sx={{ mt: 2 }}
          label="변경할 카테고리 (선택)"
        >
          {categories
            .filter((c) => c.id !== category.id)
            .map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
        </TextField>

        <Button color="error" fullWidth sx={{ mt: 2 }} onClick={handleDelete}>
          삭제
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryDeleteDialog;
