// src/services/apiService.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { authService } from "@/services/authService";

const API_BASE_URL = "http://localhost:3000/api";

interface FinancialTransaction {
  id: number;
  userId: number;
  entryType: "C" | "D";
  entryId: number;
  value: number;
  description: string;
  date: string;
  created_at?: string;
}

interface BalanceResponse {
  userId: number;
  totalCredits: number;
  totalDebits: number;
  balance: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.headers["X-Retry"]
    ) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const { accessToken } = await authService.refreshToken(refreshToken);
        localStorage.setItem("accessToken", accessToken);
        setAuthToken(accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["X-Retry"] = "true";
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchBalance = async (
  userId: number
): Promise<BalanceResponse> => {
  try {
    const response = await apiClient.get("/bank-statements/balance", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch balance");
  }
};

export const fetchTransactions = async (
  userId: number
): Promise<FinancialTransaction[]> => {
  try {
    const response = await apiClient.get("/bank-statements", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch transactions");
  }
};

export const createTransaction = async (
  transaction: Omit<FinancialTransaction, "id" | "created_at">
): Promise<FinancialTransaction> => {
  try {
    const response = await apiClient.post("/bank-statements", transaction);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create transaction");
  }
};

export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/bank-statements/${id}`);
  } catch (error) {
    throw new Error("Failed to delete transaction");
  }
};
