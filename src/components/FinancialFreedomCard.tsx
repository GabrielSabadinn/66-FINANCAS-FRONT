import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface FinancialFreedomCardProps {
  t: (key: string) => string;
  moneySaved?: number;
  moneyGoal?: number;
  percentage?: number;
}

export const FinancialFreedomCard: React.FC<FinancialFreedomCardProps> = ({
  t,
  moneySaved = 0,
  moneyGoal = 1,
  percentage,
}) => {
  const calculatedPercentage = percentage ?? (moneySaved / moneyGoal) * 100;
  const formattedPercentage = Math.round(calculatedPercentage);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - calculatedPercentage / 100);

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader className="flex justify-between items-center mb-3 md:mb-4">
        <p className="text-sm text-white font-bold md:text-base">
          {t("financial_freedom")}
        </p>
        <Button className="w-7 h-7 bg-violet-900 hover:bg-violet-900/90 rounded-xl p-0 md:w-8 md:h-8">
          <MoreHorizontal className="text-violet-400 w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col w-full md:w-1/2 gap-3">
            <div className="flex flex-col p-3 bg-gradient-to-r from-[#060C29] to-[#0A0E23] rounded-xl md:p-4">
              <p className="text-xs text-gray-400 mb-1">{t("money_saved")}</p>
              <p className="text-sm text-white font-bold md:text-base">
                ${moneySaved.toLocaleString("en-US")}
              </p>
            </div>
            <div className="flex flex-col p-3 bg-gradient-to-r from-[#060C29] to-[#0A0E23] rounded-xl md:p-4">
              <p className="text-xs text-gray-400 mb-1">{t("money_goal")}</p>
              <p className="text-sm text-white font-bold md:text-base">
                ${moneyGoal.toLocaleString("en-US")}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center w-full md:w-1/2 mt-4 md:mt-0">
            <svg className="w-32 h-32 md:w-36 md:h-36" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#05CD99"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transform -rotate-90 origin-center"
              />
              <foreignObject x="50" y="50" width="100" height="100">
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <p className="text-2xl text-white font-bold md:text-3xl">
                    {formattedPercentage}%
                  </p>
                  <p className="text-xs text-gray-400">{t("your_goal")}</p>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
