// src/hooks/useSignIn.ts
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}
interface UserData {
  id: number;
  name: string;
  email: string;
  pathImageIcon?: string;
  pathImageBanner?: string;
  createdAt?: string;
  meta?: number;
}
export const useSignIn = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userData = await login(formData.email, formData.password);

      if (userData) {
        localStorage.setItem("userName", userData.name || "");
        localStorage.setItem("userBannerImage", userData.pathImageBanner || "");
      }

      setSuccess(t("success.login_successful"));
      toast.success(t("success.login_successful"));
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err: any) {
      const errorMessage = err.message || t("errors.login_failed");
      setError(errorMessage);
      toast.error(errorMessage);
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
