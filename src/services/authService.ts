// src/services/authService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name?: string;
  };
}

interface RefreshResponse {
  accessToken: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error("Registration failed");
    }
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
      return response.data;
    } catch (error) {
      throw new Error("Invalid email or password");
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to refresh token");
    }
  },

  getUserById: async (userId: number, accessToken: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user");
    }
  },
};
