import axios from "axios";
import { API_ROUTES } from "@/config/apiRoutes";

const BASE_URL = "http://localhost:3000/api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    pwd: string;
    salt: string;
    pathImageBanner: string | null;
    pathImageIcon: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${BASE_URL}/${API_ROUTES.AUTH.REGISTER}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    }
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(
        `${BASE_URL}/${API_ROUTES.AUTH.SIGN_IN}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
    }
  },

  validateToken: async (): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No token found");
    }
    try {
      await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  },
};
