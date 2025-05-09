import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "@/services/authService";
import axios from "axios";

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
      return t("errors.name_required");
    }
    if (!formData.email.trim()) {
      return t("errors.valid_email_required");
    }
    if (!formData.password.trim()) {
      return t("errors.password_required");
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
      setSuccess(t("success.registration_successful"));
      navigate("/auth/signin");
    } catch (err) {
      console.log("Erro no registro:", err); // Depuração
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const errors = err.response.data.errors as ValidationError[];
        console.log("Erros da API:", errors); // Depuração
        if (errors && errors.length > 0) {
          const errorMsg = errors[0].msg;
          // Mapeia mensagens da API para traduções
          const errorTranslationMap: { [key: string]: string } = {
            "Name is required": "errors.name_required",
            "Valid email is required": "errors.valid_email_required",
            "Password must be at least 8 characters":
              "errors.password_min_length",
          };
          const translationKey = errorTranslationMap[errorMsg];
          setError(translationKey ? t(translationKey) : errorMsg); // Usa tradução ou msg bruta
        } else {
          setError(t("errors.registration_failed"));
        }
      } else {
        setError(t("errors.unexpected_error"));
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
