import { Dialog, DialogContent, TextField, Button, MenuItem } from "@mui/material";
import { useState } from "react";
import { updateCategoryApi } from "../../features/category/api";
import type { Category } from "../../features/category/type";

type Props = {
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
};

function CategoryEditDialog({ category, onClose, onSuccess }: Props) {
  const [name, setName] = useState(category.name);
  const [type, setType] = useState<Category["type"]>(category.type);

  const handleSave = async () => {
    await updateCategoryApi(category.id, { name, type });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <TextField
          label="이름"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          select
          label="유형"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          sx={{ mt: 2 }}
        >
          <MenuItem value="FIXED">고정비</MenuItem>
          <MenuItem value="VARIABLE">변동비</MenuItem>
        </TextField>

        <Button fullWidth sx={{ mt: 2 }} onClick={handleSave}>
          저장
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryEditDialog;
