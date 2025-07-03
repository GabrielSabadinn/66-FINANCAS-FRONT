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

interface FinancialTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  categoryId: number;
  userId: number;
}

interface Investment {
  id: number;
  UserId: number;
  CategoryId: number;
  CategoryName: string;
  Date: string;
  Description: string | null;
  Amount: number;
  ReturnPercentage: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface FixedCost {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
}

interface TableDialogProps {
  type: "transaction" | "investment" | "fixedCost";
  onSave: (
    item: Partial<FinancialTransaction | Investment | FixedCost>,
    isEdit: boolean
  ) => Promise<void> | void;
  initialData: Partial<FinancialTransaction | Investment | FixedCost>;
}

const TableDialogue: React.FC<TableDialogProps> = ({
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
        name === "amount" ||
          name === "ReturnPercentage" ||
          name === "CategoryId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    await onSave(formData, isEdit);
    setIsOpen(false);
    if (!isEdit) {
      setFormData(initialData);
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
          <div>
            <Label>{t("date")}</Label>
            <Input
              placeholder={t("date")}
              type="date"
              name={
                type === "fixedCost"
                  ? "dueDate"
                  : type === "investment"
                    ? "Date"
                    : "date"
              }
              value={
                type === "fixedCost"
                  ? (formData as Partial<FixedCost>).dueDate || ""
                  : type === "investment"
                    ? (formData as Partial<Investment>).Date || ""
                    : (formData as Partial<FinancialTransaction>).date || ""
              }
              onChange={handleChange}
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
            />
          </div>
          <div>
            <Label>{t("description")}</Label>
            <Input
              placeholder={t("description")}
              name={type === "investment" ? "Description" : "description"}
              value={
                type === "investment"
                  ? (formData as Partial<Investment>).Description || ""
                  : (formData as Partial<FinancialTransaction | FixedCost>)
                    .description || ""
              }
              onChange={handleChange}
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
            />
          </div>
          <div>
            <Label>{t("amount")}</Label>
            <Input
              type="number"
              placeholder={t("amount")}
              name={type === "investment" ? "Amount" : "amount"}
              value={
                type === "investment"
                  ? (formData as Partial<Investment>).Amount || ""
                  : (formData as Partial<FinancialTransaction | FixedCost>)
                    .amount || ""
              }
              onChange={handleChange}
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          {type === "transaction" && (
            <>
              <div>
                <Label>{t("type")}</Label>
                <select
                  name="type"
                  value={(formData as Partial<FinancialTransaction>).type || ""}
                  onChange={handleChange}
                  className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded w-full"
                >
                  <option value="income">{t("last_incomes")}</option>
                  <option value="expense">{t("last_expenses")}</option>
                </select>
              </div>
              <div>
                <Label>{t("category")}</Label>
                <Input
                  type="number"
                  placeholder={t("category")}
                  name="categoryId"
                  value={
                    (formData as Partial<FinancialTransaction>).categoryId || ""
                  }
                  onChange={handleChange}
                  className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </>
          )}
          {type === "investment" && (
            <>
              <div>
                <Label>{t("return_rate")}</Label>
                <Input
                  type="number"
                  placeholder={t("return_rate")}
                  name="ReturnPercentage"
                  value={
                    (formData as Partial<Investment>).ReturnPercentage || ""
                  }
                  onChange={handleChange}
                  className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label>{t("category")}</Label>
                <Input
                  type="number"
                  placeholder={t("category")}
                  name="CategoryId"
                  value={(formData as Partial<Investment>).CategoryId || ""}
                  onChange={handleChange}
                  className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </>
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

export default TableDialogue;
