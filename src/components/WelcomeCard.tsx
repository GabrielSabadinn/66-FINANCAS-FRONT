import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WelcomeCardProps {
  t: (key: string) => string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ t }) => {
  const [randomImage, setRandomImage] = useState("");
  const [customImage, setCustomImage] = useState<string | null>(null);

  useEffect(() => {
    if (!customImage) {
      // Usando Lorem Picsum para imagens aleatórias como fallback
      const timestamp = Date.now();
      setRandomImage(`https://picsum.photos/600/400?random=${timestamp}`);
    }
  }, [customImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);
    }
  };

  const backgroundImage = customImage || randomImage;

  return (
    <Card className="p-0 border-none relative min-h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-violet-900/50"></div>
      </div>
      <CardContent className="w-full h-full p-6 relative z-10">
        <div className="flex flex-col h-full">
          <p className="text-sm text-gray-400 font-bold">{t("welcome_back")}</p>
          <p className="text-2xl text-white font-bold mb-4">Nome do cliente</p>
          <p className="text-md text-gray-400 mb-4">{t("glad_to_see")}</p>

          {/* Campo para editar imagem */}
          <div className="mb-4">
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
              onChange={handleImageUpload}
            />
          </div>

          <p className="text-md text-gray-400 mb-auto">{t("ask_me")}</p>
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
