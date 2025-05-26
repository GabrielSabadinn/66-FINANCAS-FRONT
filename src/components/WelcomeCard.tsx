import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/context/AuthContext";

interface WelcomeCardProps {
  t: (key: string) => string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ t }) => {
  const [randomImage, setRandomImage] = useState("");
  const [userName, setUserName] = useState("Nome do cliente");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set random image
    const timestamp = Date.now();
    setRandomImage(`https://picsum.photos/600/400?random=${timestamp}`);

    // Fetch user name
    const fetchUserName = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("No accessToken found in localStorage");
        setUserName("Nome do cliente");
        setLoading(false);
        return;
      }

      try {
        // Validate token client-side
        const decoded: JwtPayload = jwtDecode(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          console.log("Token expired");
          setUserName("Nome do cliente");
          setLoading(false);
          return;
        }
        console.log("Token decoded:", decoded);
        const userId = decoded.userId;

        // Try to get name from localStorage first
        const storedName = localStorage.getItem("userName");
        if (storedName) {
          console.log("Using stored user name:", storedName);
          setUserName(storedName);
          setLoading(false);
          return;
        }

        // Fallback to API call
        const user = await authService.getUserById(userId, accessToken);
        console.log("User fetched from API:", user);
        const name = user.name || "Nome do cliente";
        if (!user.name) {
          console.warn("No name returned from API, using fallback");
        }
        setUserName(name);
        localStorage.setItem("userName", name);
      } catch (error: any) {
        console.error("Error fetching user name:", error.message);
        setUserName("Nome do cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, []);

  return (
    <Card className="p-0 border-none relative min-h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${randomImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-violet-900/50"></div>
      </div>
      <CardContent className="w-full h-full p-6 relative z-10">
        <div className="flex flex-col h-full">
          <p className="text-sm text-gray-400 font-bold">{t("welcome_back")}</p>
          <p className="text-2xl text-white font-bold mb-4">
            {loading ? "Carregando..." : userName}
          </p>
          <p className="text-md text-gray-400 mb-auto">
            {t("glad_to_see")}
            <br />
            {t("ask_me")}
          </p>
          <Button
            variant="ghost"
            className="p-0 bg-transparent hover:bg-transparent text-white font-bold text-sm flex items-left mt-6"
          >
            {t("tab_record")}
            <ArrowRight className="w-5 h-5 ml-2 text-violet-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
