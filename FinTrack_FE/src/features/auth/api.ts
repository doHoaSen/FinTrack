import { api } from "../../shared/api/axios";

type LoginRequest = {
    email: string;
    password: string;
};

type LoginResponse = {
    accessToken: string;
    user: {
        id: number;
        email: string;
    };
};

type SignupRequest = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> =>{
    const res = await api.post("/api/auth/login", data);
    return res.data;
};

export const signupApi = async (data: SignupRequest) => {
    await api.post("/api/user/signup", data);
};