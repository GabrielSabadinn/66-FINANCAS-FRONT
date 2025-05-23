import axios from "axios";
import { authService } from "./authService";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

let accessToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const { accessToken: newAccessToken } = await authService.refreshToken(
          refreshToken
        );
        setAuthToken(newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

interface BalanceResponse {
  balance: number;
}

interface FinancialTransaction {
  Id: number;
  UserId: number;
  EntryType: "C" | "D";
  EntryId: number;
  Value: number;
  Description: string;
  Date: string;
  Created_At?: string;
}

export const fetchBalance = async (
  userId: number
): Promise<BalanceResponse> => {
  const response = await api.get(`/bank-statements/balance?userId=${userId}`);
  return response.data;
};

export const fetchTransactions = async (
  userId: number
): Promise<FinancialTransaction[]> => {
  const response = await api.get(`/bank-statements?userId=${userId}`);
  return response.data;
};

export const createTransaction = async (
  transaction: Omit<FinancialTransaction, "Id" | "Created_At">
): Promise<FinancialTransaction> => {
  const payload = {
    userId: transaction.UserId,
    entryType: transaction.EntryType,
    entryId: transaction.EntryId,
    value: transaction.Value,
    description: transaction.Description,
    date: transaction.Date,
  };
  console.log("API createTransaction payload:", payload);
  const response = await api.post("/bank-statements", payload);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/bank-statements/${id}`);
};
