import {create} from "zustand";
import { api } from "../shared/api/axios";

export type Category = {
    id: number;
    name: string;
    type: "FIXED" | "VARIABLE";
};

type CategoryStore = {
    categories: Category[];
    fetchCategories: () => Promise<void>;
    addCategory: (payload: {name: string; type: Category["type"]}) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],

    fetchCategories: async() => {
        const res = await api.get("/api/categories");
        set({categories: res.data.data});
    },

    addCategory: async(payload) => {
        await api.post("/api/categories", payload);
        const res = await api.get("api/categories");
        set({categories: res.data.data});
    },
}));