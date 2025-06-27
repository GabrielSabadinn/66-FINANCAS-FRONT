import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { metaService } from "@/services/metaService";

interface FinancialFreedomCardProps {
  t: (key: string) => string;
  moneySaved?: number;
  moneyGoal?: number;
  percentage: number;
  onGoalUpdate?: (newGoal: number) => void;
}

export const FinancialFreedomCard: React.FC<FinancialFreedomCardProps> = ({
  t,
  moneySaved = 0,
  moneyGoal = 1,
  percentage,
  onGoalUpdate,
}) => {
  const { t: translate } = useTranslation();
  // const calculatedPercentage = percentage ?? (moneySaved / moneyGoal) * 100;
  const formattedPercentage = Math.round(percentage);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const [isOpen, setIsOpen] = useState(false);
  const [newGoal, setNewGoal] = useState(moneyGoal.toString());

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const goalValue = parseFloat(newGoal);

    if (!isNaN(goalValue) && goalValue > 0 && (userId != null && accessToken != null)) {

      await metaService.putMeta(goalValue, Number(userId), accessToken);
      // onGoalUpdate(goalValue);
    }
    setIsOpen(false);
    setNewGoal(goalValue.toString());
  };

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader className="flex justify-between items-center mb-3 md:mb-4">
        <p className="text-sm text-white font-bold md:text-base">
          {t("financial_freedom")}
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-7 h-7 bg-violet-900 hover:bg-violet-900/90 rounded-xl p-0 md:w-8 md:h-8"
              aria-label="Set financial goal"
            >
              <MoreHorizontal className="text-violet-400 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[rgb(30,32,70)] text-white border-none backdrop-blur-md">
            <DialogHeader>
              <DialogTitle>{t("set_financial_goal")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                type="number"
                placeholder={t("new_money_goal")}
                name="newGoal"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
                min="1"
                step="0.01"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {t("save")}
            </Button>
          </DialogContent>
        </Dialog>
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
