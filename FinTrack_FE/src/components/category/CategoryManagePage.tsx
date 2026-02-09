import { useEffect, useState } from "react";
import CategoryManageList from "./CategoryManageList";
import { getCategoriesApi } from "../../features/category/api";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import CategoryEditDialog from "./CategoryEditDialog";
import type { Category } from "../../features/category/type";


function CategoryManagePage() {
  const [categories, setCategories] = useState<Category[]>([]);
 const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetchCategories = async () => {
    const data = await getCategoriesApi();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <CategoryManageList
        categories={categories}
        onEdit={(c) => setEditTarget(c)}
        onDelete={(c) => setDeleteTarget(c)}
      />

      {/* 수정 다이얼로그 */}
      {editTarget && (
        <CategoryEditDialog
          category={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchCategories}
        />
      )}

      {/* 삭제 다이얼로그 */}
      {deleteTarget && (
        <CategoryDeleteDialog
          category={deleteTarget}
          categories={categories}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchCategories}
        />
      )}
    </>
  );
}

export default CategoryManagePage;
