import { api } from "../../shared/api/axios";
import type { Category } from "./type";

export const getCategoriesApi = async (): Promise<Category[]> => {
  const res = await api.get("/api/categories");
  return res.data.data;
};

export const updateCategoryApi = async(
    id: number,
    payload: {name: string; type: "FIXED" | "VARIABLE"}
) => {
    await api.put(`/api/categories/${id}`, payload);
};

export const deleteCategoryApi = async (id: number) => {
  await api.delete(`/api/categories/${id}`);
};

export const replaceAndDeleteCategoryApi = async (
  id: number,
  targetCategoryId: number
) => {
  await api.post(`/api/categories/${id}/replace-and-delete`, {
    targetCategoryId,
  });
};