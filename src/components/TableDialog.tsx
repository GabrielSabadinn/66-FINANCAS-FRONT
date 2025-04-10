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
import { Plus, Pencil } from "lucide-react"; // Adicionado Pencil

interface FinancialTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}

interface Investment {
  id: number;
  date: string;
  description: string;
  amount: number;
  returnRate: number;
}

interface FixedCost {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
}

interface TableDialogProps {
  type: "transaction" | "investment" | "fixedCost";
  onSave: (item: any, isEdit: boolean) => void;
  initialData: FinancialTransaction | Investment | FixedCost;
}

const TableDialog: React.FC<TableDialogProps> = ({
  type,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const isEdit = initialData.id !== 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "returnRate" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData, isEdit);
    setIsOpen(false);
    if (!isEdit) {
      setFormData(initialData); // Reset para valores iniciais após adicionar
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
            {isEdit
              ? t(
                  type === "transaction"
                    ? "edit_transaction"
                    : type === "investment"
                    ? "edit_investment"
                    : "edit_fixed_cost"
                )
              : t(
                  type === "transaction"
                    ? "add_transaction"
                    : type === "investment"
                    ? "add_investment"
                    : "add_fixed_cost"
                )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder={t("date")}
            type="date"
            name={type === "fixedCost" ? "dueDate" : "date"}
            value={
              type === "fixedCost"
                ? (formData as FixedCost).dueDate
                : (formData as FinancialTransaction | Investment).date
            }
            onChange={handleChange}
            className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
          />
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
          {type === "transaction" && (
            <select
              name="type"
              value={(formData as FinancialTransaction).type}
              onChange={handleChange}
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded"
            >
              <option value="income">{t("last_incomes")}</option>
              <option value="expense">{t("last_expenses")}</option>
            </select>
          )}
          {type === "investment" && (
            <Input
              type="number"
              placeholder="Taxa de Retorno (%)"
              name="returnRate"
              value={(formData as Investment).returnRate}
              onChange={handleChange}
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
            />
          )}
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {t(isEdit ? "save_changes" : "sign_up_button")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TableDialog;
