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

interface UserResponse {
  Id: number; // Ajustado para maiúsculo
  Name: string; // Ajustado para maiúsculo
  Email: string; // Ajustado para maiúsculo
  PathImageBanner: string | null; // Ajustado para maiúsculo
  PathImageIcon: string | null; // Ajustado para maiúsculo
  CreatedAt: string; // Ajustado para maiúsculo
  UpdatedAt: string; // Ajustado para maiúsculo
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

  getUserById: async (
    userId: number,
    accessToken: string
  ): Promise<UserResponse> => {
    try {
      const response = await axios.get<UserResponse>(
        `${BASE_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Resposta da API em getUserById:", response.data); // Para depuração
      return response.data;
    } catch (error) {
      console.error("Erro em getUserById:", error);
      throw new Error("Failed to fetch user data.");
    }
  },
};
