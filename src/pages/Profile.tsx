import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Camera, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { fetchUser, updateUser, uploadImage } from "@/services/apiService";
import { User } from "@/types";

export default function Profile() {
  const { t } = useTranslation();
  const { userId, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [tempProfileImage, setTempProfileImage] = useState<File | null>(null);
  const [tempDashboardImage, setTempDashboardImage] = useState<File | null>(
    null
  );
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [dashboardImagePreview, setDashboardImagePreview] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [isAuthenticated, userId]);

  const fetchUserData = async () => {
    try {
      if (!userId) throw new Error("No user ID found");
      const user = await fetchUser(userId);
      console.log("Fetched user data:", user);
      setUserData(user);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      toast.error(t("errors.fetch_user_failed") || "Failed to fetch user data");
      logout();
    }
  };

  const getDefaultAvatar = (seed: string) =>
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDashboardImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempDashboardImage(file);
      setDashboardImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!userData || !userId) return;
    if (!userData.name || userData.name.trim() === "") {
      toast.error(t("errors.name_required") || "Name is required");
      return;
    }
    try {
      let pathImageIcon = userData.pathImageIcon;
      let pathImageBanner = userData.pathImageBanner;

      if (tempProfileImage) {
        const { path } = await uploadImage(tempProfileImage);
        pathImageIcon = path;
      }
      if (tempDashboardImage) {
        const { path } = await uploadImage(tempDashboardImage);
        pathImageBanner = path;
      }

      const updatedUser = await updateUser(userId, {
        name: userData.name,
        email: userData.email,
        pathImageIcon,
        pathImageBanner,
      });

      console.log("Updated user data:", updatedUser);
      localStorage.setItem("userName", updatedUser.name);
      setUserData(updatedUser);
      setTempProfileImage(null);
      setTempDashboardImage(null);
      setProfileImagePreview(null);
      setDashboardImagePreview(null);
      toast.success(t("profile_saved") || "Profile saved successfully");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error(t("errors.save_profile_failed") || "Failed to save profile");
    }
  };

  const backgroundStyle = {
    background:
      "linear-gradient(90deg, rgba(71,5,138,1) 0%, rgba(22,10,33,1) 50%, rgba(71,5,138,1) 100%)",
  };

  if (loading || !userData) {
    return (
      <div
        className="flex flex-col min-h-screen p-4 md:p-6 text-white"
        style={backgroundStyle}
      >
        <div className="max-w-2xl mx-auto w-full pt-14 md:pt-16">
          <p>{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  const joinedDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("pt-BR")
    : "Desconhecido";

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-6 text-white"
      style={backgroundStyle}
    >
      <div className="max-w-2xl mx-auto w-full pt-14 md:pt-16">
        <Card className="bg-[rgb(19,21,54)] border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {t("profile_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seção de Imagem de Perfil */}
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage
                  src={
                    profileImagePreview ||
                    userData.pathImageIcon ||
                    getDefaultAvatar(userData.name)
                  }
                  alt={userData.name}
                />
                <AvatarFallback>
                  <UserIcon className="w-12 h-12 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="profileImage"
                className="flex items-center gap-2 text-violet-400 cursor-pointer hover:text-violet-300"
              >
                <Camera className="w-5 h-5" />
                {t("change_profile_picture")}
              </Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
            </div>

            {/* Informações do Usuário */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  {t("name_label")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="bg-[rgb(30,32,70)] border-none text-white px-4 py-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  {t("email_label")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="bg-[rgb(30,32,70)] border-none text-white px-4 py-2"
                />
              </div>
            </div>

            {/* Seção de Imagem do Dashboard */}
            <div className="space-y-4">
              <Label htmlFor="dashboardImage" className="text-white">
                {t("dashboard_image_label")}
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 bg-gray-700 rounded-md overflow-hidden">
                  <img
                    src={
                      dashboardImagePreview ||
                      userData.pathImageBanner ||
                      "https://picsum.photos/600/400"
                    }
                    alt="Dashboard Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Label
                  htmlFor="dashboardImage"
                  className="flex items-center gap-2 text-violet-400 cursor-pointer hover:text-violet-300"
                >
                  <Camera className="w-5 h-5" />
                  {t("change_dashboard_image")}
                </Label>
                <Input
                  id="dashboardImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDashboardImageUpload}
                />
              </div>
            </div>

            {/* Botão de Salvar */}
            <Button
              onClick={handleSave}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Save className="w-5 h-5 mr-2" />
              {t("save_changes")}
            </Button>
          </CardContent>
        </Card>

        {/* Extra: Seção de Estatísticas Rápidas */}
        <Card className="mt-6 bg-[rgb(19,21,54)] border-none">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              {t("quick_stats")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{t("joined_date")}</span>
              <span>{joinedDate}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{t("total_transactions2")}</span>
              <span>145</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
