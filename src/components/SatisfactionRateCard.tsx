import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Smile } from "lucide-react";

interface SatisfactionRateCardProps {
  t: (key: string) => string;
}

export const SatisfactionRateCard: React.FC<SatisfactionRateCardProps> = ({
  t,
}) => {
  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader className="mb-6">
        <div className="flex flex-col">
          <p className="text-lg text-white font-bold mb-1">
            {t("satisfaction_rate")}
          </p>
          {/*         <p className="text-sm text-gray-400"></p> */}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center relative">
        <svg width="200" height="200" className="relative">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#582CFF"
            strokeWidth="12"
            fill="none"
            strokeDasharray="565.48"
            strokeDashoffset={565.48 * (1 - 0.8)}
            className="transform -rotate-90 origin-center"
          />
          <foreignObject x="50" y="50" width="100" height="100">
            <div className="flex justify-center items-center w-full h-full">
              <div className="flex items-center justify-center w-12 h-12 bg-violet-600 rounded-full mb-5">
                <Smile className="w-7 h-7 text-white" />
              </div>
            </div>
          </foreignObject>
        </svg>
        <div className="absolute bottom-5 flex flex-row justify-between items-center px-6 py-4 bg-gradient-to-r from-[#060C29] to-[#0A0E23] rounded-[20px] w-[270px] md:w-[300px]">
          <p className="text-xs text-gray-400">0%</p>
          <div className="flex flex-col items-center min-w-[80px]">
            <p className="text-2xl text-white font-bold">85%</p>
            <p className="text-xs text-gray-400">
              {" "}
              {t("satisfaction_rate_description")}
            </p>
          </div>
          <p className="text-xs text-gray-400">100%</p>
        </div>
      </CardContent>
    </Card>
  );
};
