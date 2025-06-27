import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { FinancialTransaction } from "@/types";
import { toast } from "react-toastify";

interface TableDialogProps {
  onSave?: (data: {
    description: string;
    amount: number;
    type?: "income" | "expense";
  }) => void;
  initialData: FinancialTransaction;
  title: string;
}
interface FormData {
  description: string;
  amount: number;
  type: "income" | "expense";
}

const RegisterDialog: React.FC<TableDialogProps> = ({
  onSave,
  initialData,
  title,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: "",
    amount: 0,
    type: "income",
  });

  const isEdit = initialData.Id !== 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log("formData:", formData);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (formData.description && formData.amount > 0) {
      if (onSave) {
        onSave({
          description: formData.description,
          amount: formData.amount,
          type: title === t("today_money") ? formData.type : undefined,
        });
      }
      setIsOpen(false);
      setFormData({ description: "", amount: 0, type: "income" });
    } else {
      toast.error(t("errors.invalid_input"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEdit ? "ghost" : "outline"}
          size={isEdit ? "sm" : "default"}
          className={
            isEdit ? "" : "bg-violet-600 hover:bg-violet-700 text-white"
          }
        >
          {isEdit ? (
            <Pencil className="h-4 w-4 text-violet-400" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {!isEdit && t("tab_record")}
        </Button>
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
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {t("sign_up_button")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
