import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormData {
  description: string;
  amount: number;
  type: "income" | "expense";
}

interface MiniStatisticsCardProps {
  title: string;
  value: number | string;
  percentage?: string;
  percentageColor?: string;
  icon: LucideIcon;
  onAdd?: (data: {
    description: string;
    amount: number;
    type?: "income" | "expense";
  }) => void;
}

export const MiniStatisticsCard: React.FC<MiniStatisticsCardProps> = ({
  title,
  value,
  percentage = "",
  percentageColor = "text-gray-400",
  icon: Icon,
  onAdd,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: "",
    amount: 0,
    type: "income",
  });

  const formattedValue =
    typeof value === "number" ? value.toLocaleString("en-US") : value;

  const handleEditClick = () => {
    navigate("/tables");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleAddSubmit = () => {
    if (onAdd) {
      onAdd({
        description: formData.description,
        amount: formData.amount,
        type: title === t("today_money") ? formData.type : undefined,
      });
    }
    setIsOpen(false);
    setFormData({ description: "", amount: 0, type: "income" });
  };

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-1">{title}</p>
            <div className="flex items-center gap-1">
              <p className="text-lg text-white md:text-xl">${formattedValue}</p>
              {percentage && (
                <p className={`${percentageColor} font-bold text-xs`}>
                  {percentage}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Add new ${title}`}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[rgb(30,32,70)] text-white border-none">
                  <DialogHeader>
                    <DialogTitle>
                      {t("add")} {title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder={t("description")}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
                    />
                    <Input
                      type="number"
                      placeholder={t("amount")}
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
                    />
                    {title === t("today_money") && (
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded"
                      >
                        <option value="income">{t("last_incomes")}</option>
                        <option value="expense">{t("last_expenses")}</option>
                      </select>
                    )}
                  </div>
                  <Button
                    onClick={handleAddSubmit}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {t("sign_up_button")}
                  </Button>
                </DialogContent>
              </Dialog>
              <button
                onClick={handleEditClick}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`Edit ${title}`}
              >
                <Edit2 className="w-4 h-4 mr-2" />
              </button>
            </div>
            <div className="flex items-center justify-center w-9 h-9 bg-violet-600 rounded-lg md:w-10 md:h-10">
              <Icon className="w-4 h-4 text-white md:w-5 md:h-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
