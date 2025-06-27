import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUser } from "@/services/apiService";

interface WelcomeCardProps {
  t: (key: string) => string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ t }) => {
  const [bannerImage, setBannerImage] = useState("");
  const [userName, setUserName] = useState("");
  const { userId } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
      }

      try {
        if (userId) {
          const user = await fetchUser(userId);
          // Usa a imagem do banner do usuário se existir
          if (user.pathImageBanner) {
            setBannerImage(user.pathImageBanner);
          } else {
            setRandomImage();
          }
        } else {
          setRandomImage();
        }
      } catch (error) {
        console.error("Failed to fetch user banner:", error);
        setRandomImage();
      }
    };

    loadUserData();
  }, [userId]);

  const setRandomImage = () => {
    const timestamp = Date.now();
    setBannerImage(`https://picsum.photos/600/400?random=${timestamp}`);
  };

  return (
    <Card className="p-0 border-none relative min-h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-violet-900/50"></div>
      </div>
      <CardContent className="w-full h-full p-6 relative z-10">
        <div className="flex flex-col h-full">
          <p className="text-sm text-gray-400 font-bold">{t("welcome_back")}</p>
          <p className="text-2xl text-white font-bold mb-4">
            {userName || "Usuário"}
          </p>
          <p className="text-md text-gray-400 mb-auto">
            {t("glad_to_see")}
            <br />
            {/*          {t("ask_me")} */}
          </p>
          <Button
            variant="ghost"
            className="p-0 bg-transparent hover:bg-transparent text-white font-bold text-sm flex items-left mt-6"
          >
            {/*     {t("tab_record")} */}
            <ArrowRight className="w-5 h-5 ml-2 text-violet-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
