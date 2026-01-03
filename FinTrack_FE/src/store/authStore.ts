import { create } from "zustand";

type User = {
  name: string;
  email: string;
};

type AuthStore = {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  user: null,
  isLoading: false,

  login: (token, user) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token, user });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null, user: null });
  },
}));
