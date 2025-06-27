import axios from "axios";

export const API_BASE_URL = "http://localhost:3000/api";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name?: string;
    pathImageBanner?: string;
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

export interface User {
  id: number;
  name: string;
  email: string;
  Pwd?: string;
  salt?: string;
  pathImageBanner?: string | null;
  pathImageIcon?: string | null;
  createdAt: Date;
  updatedAt: Date;
  meta?: number;
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
      throw new Error("E-mail ou senha inválidos por favor tente novamente");
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

  getUserById: async (userId: number, accessToken: string): Promise<User> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = response.data;
      if (!user.name) {
        console.warn(`No name found for user ${userId}`);
      }
      return user;
    } catch (error: any) {
      console.error(
        "Failed to fetch user:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch user");
    }
  },
};
