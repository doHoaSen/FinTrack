import {create} from "zustand";
import { getDashboardApi } from "../features/dashboard/api";

type DashboardStore = {
  joinedYear: number | null;
  isLoaded: boolean;
  fetchDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  joinedYear: null,
  isLoaded: false,

  fetchDashboard: async () => {
    if (get().isLoaded) return; // 중복 호출 방지

    const data = await getDashboardApi();

    set({
      joinedYear: data.joinedYear,
      isLoaded: true,
    });
  },
}));