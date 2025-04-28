import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { User, Camera, Save } from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();

  const [userData, setUserData] = useState({
    name: "Gabriel Sabadin",
    email: "gabriel.sabadin@example.com",
    bio: "Apaixonado por finanças e tecnologia!",
    profileImage: "",
    dashboardImage: "",
  });
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);
  const [tempDashboardImage, setTempDashboardImage] = useState<string | null>(
    null
  );

  const getDefaultAvatar = (seed: string) =>
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempProfileImage(imageUrl);
    }
  };

  const handleDashboardImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempDashboardImage(imageUrl);
    }
  };

  const handleSave = () => {
    setUserData((prev) => ({
      ...prev,
      profileImage: tempProfileImage || prev.profileImage,
      dashboardImage: tempDashboardImage || prev.dashboardImage,
    }));
    setTempProfileImage(null);
    setTempDashboardImage(null);
    alert(t("profile_saved"));
  };

  const backgroundStyle = {
    background:
      "linear-gradient(90deg, rgba(71,5,138,1) 0%, rgba(22,10,33,1) 50%, rgba(71,5,138,1) 100%)",
  };

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
                    tempProfileImage ||
                    userData.profileImage ||
                    getDefaultAvatar(userData.name)
                  }
                  alt={userData.name}
                />
                <AvatarFallback>
                  <User className="w-12 h-12 text-gray-400" />
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
              <div>
                <Label htmlFor="bio" className="text-white">
                  {t("bio_label")}
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  className="bg-[rgb(30,32,70)] border-none text-white px-4 py-2"
                  rows={3}
                />
              </div>
            </div>

            {/* Nova Seção: Imagem do Dashboard */}
            <div className="space-y-4">
              <Label htmlFor="dashboardImage" className="text-white">
                {t("dashboard_image_label")}
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 bg-gray-700 rounded-md overflow-hidden">
                  <img
                    src={
                      tempDashboardImage ||
                      userData.dashboardImage ||
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
              <span>Jan 2023</span>
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
