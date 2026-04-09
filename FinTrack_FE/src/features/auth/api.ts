import { api } from "../../shared/api/axios";

type LoginRequest = {
    email: string;
    password: string;
    autoLogin: boolean;
};

type LoginResponse = {
    name: string;
    email: string;
};

type SignupRequest = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const loginApi = async (payload: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post("/api/auth/login", payload);
    return res.data.data;
};

export const logoutApi = async () => {
    await api.post("/api/auth/logout");
};

export const signupApi = async (data: SignupRequest) => {
    await api.post("/api/user/signup", data);
};

export const withdrawApi = async () => {
    await api.delete("/api/user/me");
};
