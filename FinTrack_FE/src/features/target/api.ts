import { api } from "../../shared/api/axios";
import type { TargetResponse } from "../dashboard/api";

const API_BASE = "/api/targets";

export const getTargetApi = async (): Promise<TargetResponse> => {
  const res = await api.get(API_BASE);
  return res.data.data;
};

export const createTargetApi = async (amount: number): Promise<TargetResponse> => {
  const res = await api.post(API_BASE, { amount });
  return res.data.data;
};

export const updateTargetApi = async (amount: number): Promise<TargetResponse> => {
  const res = await api.put(API_BASE, { amount });
  return res.data.data;
};

export const deleteTargetApi = async (): Promise<void> => {
  await api.delete(API_BASE);
};
