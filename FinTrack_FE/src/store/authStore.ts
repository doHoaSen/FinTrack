import { create } from "zustand";

type User = {
    name: string;
    email: string;
};

type AuthStore = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

const savedUser = localStorage.getItem("user");

export const useAuthStore = create<AuthStore>((set) => ({
    user: savedUser ? JSON.parse(savedUser) : null,

    login: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    logout: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },
}));
