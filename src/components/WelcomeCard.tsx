import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";

interface WelcomeCardProps {
  t: (key: string) => string;
}

interface TokenPayload {
  userId: number;
  email: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ t }) => {
  const [randomImage, setRandomImage] = useState("");
  const [userName, setUserName] = useState("Nome do cliente");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define a imagem aleatória
    const timestamp = Date.now();
    setRandomImage(`https://picsum.photos/600/400?random=${timestamp}`);

    // Busca o nome do usuário
    const fetchUserName = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Nenhum accessToken encontrado no localStorage");
        setUserName("Nome do cliente");
        setLoading(false);
        return;
      }

      try {
        // Valida o token antes de usar
        await authService.validateToken();
        console.log("Token validado com sucesso");

        // Decodifica o token para obter o userId
        const decoded: TokenPayload = jwtDecode(accessToken);
        console.log("Token decodificado:", decoded);
        const userId = decoded.userId;

        // Busca o usuário com authService
        const user = await authService.getUserById(userId, accessToken);
        console.log("Usuário retornado:", user);
        setUserName(user.Name); // Usa Name (maiúsculo)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
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
