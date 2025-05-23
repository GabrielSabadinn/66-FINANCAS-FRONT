import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "@/services/authService";
import { setAuthToken } from "@/services/apiService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/context/AuthContext";

interface FormData {
  name: string;
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

interface ValidationError {
  msg: string;
}

export const useRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return t("errors.name_required") || "Name is required";
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      return t("errors.valid_email_required") || "Valid email is required";
    }
    if (formData.password.length < 8) {
      return (
        t("errors.password_min_length") ||
        "Password must be at least 8 characters"
      );
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response: AuthResponse = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, refreshToken, user } = response;
      const decoded: JwtPayload = jwtDecode(accessToken);
      const userId = decoded.userId;

      if (!userId) {
        throw new Error("User ID not found in token");
      }

      // Store tokens and user data in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("userName", user.name || formData.name);

      // Set auth token for API requests
      setAuthToken(accessToken);

      setSuccess(
        t("success.registration_successful") || "Registration successful"
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const errors = err.response.data.errors as ValidationError[];
        if (errors && errors.length > 0) {
          const errorMsg = errors[0].msg;
          const errorTranslationMap: { [key: string]: string } = {
            "Name is required": "errors.name_required",
            "Valid email is required": "errors.valid_email_required",
            "Password must be at least 8 characters":
              "errors.password_min_length",
            "Email already exists": "errors.email_already_exists",
          };
          const translationKey = errorTranslationMap[errorMsg];
          setError(translationKey ? t(translationKey) : errorMsg);
        } else {
          setError(t("errors.registration_failed") || "Registration failed");
        }
      } else {
        setError(
          t("errors.unexpected_error") || "An unexpected error occurred"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    success,
    loading,
    handleInputChange,
    handleSubmit,
  };
};
