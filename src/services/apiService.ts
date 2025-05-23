import axios from "axios";
import { authService } from "./authService";
import { FinancialTransaction, User } from "@/types";

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
  transaction: Omit<FinancialTransaction, "id" | "created_at">
): Promise<FinancialTransaction> => {
  const payload = {
    userId: transaction.userId,
    entryType: transaction.entryType,
    entryId: transaction.entryId,
    value: transaction.value,
    description: transaction.description,
    date: transaction.date,
  };
  console.log("API createTransaction payload:", payload);
  const response = await api.post("/bank-statements", payload);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/bank-statements/${id}`);
};

export const fetchUser = async (userId: number): Promise<User> => {
  const response = await api.get(`/users/${userId}`);
  const data = response.data;
  return {
    id: data.Id,
    name: data.Name || "Usuário",
    email: data.Email,
    pathImageIcon: data.PathImageIcon,
    pathImageBanner: data.PathImageBanner,
    createdAt: data.CreatedAt,
  };
};

export const updateUser = async (
  userId: number,
  data: Partial<User>
): Promise<User> => {
  console.log("updateUser input data:", {
    name: data.name,
    email: data.email,
    pathImageIcon: data.pathImageIcon,
    pathImageBanner: data.pathImageBanner,
  });
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    console.error("Invalid name provided:", data.name);
    throw new Error("Name must be a non-empty string");
  }
  const payload: {
    name: string;
    email?: string;
    pathImageIcon?: string;
    pathImageBanner?: string;
  } = {
    name: data.name,
  };
  if (data.email) {
    payload.email = data.email;
  }
  if (
    data.pathImageIcon &&
    typeof data.pathImageIcon === "string" &&
    data.pathImageIcon.trim() !== ""
  ) {
    payload.pathImageIcon = data.pathImageIcon;
  }
  if (
    data.pathImageBanner &&
    typeof data.pathImageBanner === "string" &&
    data.pathImageBanner.trim() !== ""
  ) {
    payload.pathImageBanner = data.pathImageBanner;
  }
  console.log("Update user payload:", payload);
  const response = await api.put(`/users/${userId}`, payload);
  const updatedData = response.data;
  return {
    id: updatedData.Id,
    name: updatedData.Name || "Usuário",
    email: updatedData.Email,
    pathImageIcon: updatedData.PathImageIcon,
    pathImageBanner: updatedData.PathImageBanner,
    createdAt: updatedData.CreatedAt,
  };
};

export const uploadImage = async (file: File): Promise<{ path: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  console.log("Uploading image:", file.name);
  try {
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Upload response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Image upload failed:", err.response?.data || err.message);
    throw err;
  }
};
