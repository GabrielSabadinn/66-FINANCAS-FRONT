// src/components/TransactionTable.tsx
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { useState, useEffect } from "react";

interface FinancialTransaction {
  id: number;
  userId: number;
  entryType: "C" | "D";
  entryId: number;
  value: number;
  description: string;
  date: string;
  created_at?: string;
}

interface TransactionTableProps {
  transactions: FinancialTransaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  const { t } = useTranslation();
  const [filteredTransactions, setFilteredTransactions] =
    useState<FinancialTransaction[]>(transactions);
  const [filters, setFilters] = useState({
    month: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const filterTransactions = (t: FinancialTransaction) => {
    const date = new Date(t.date);
    const monthMatch = filters.month
      ? date.getMonth() + 1 === parseInt(filters.month)
      : true;
    const minAmountMatch = filters.minAmount
      ? t.value >= parseFloat(filters.minAmount)
      : true;
    const maxAmountMatch = filters.maxAmount
      ? t.value <= parseFloat(filters.maxAmount)
      : true;
    const startDateMatch = filters.startDate
      ? new Date(t.date) >= new Date(filters.startDate)
      : true;
    const endDateMatch = filters.endDate
      ? new Date(t.date) <= new Date(filters.endDate)
      : true;
    return (
      monthMatch &&
      minAmountMatch &&
      maxAmountMatch &&
      startDateMatch &&
      endDateMatch
    );
  };

  const filtered = filteredTransactions.filter(filterTransactions);

  const handleDelete = async (id: number) => {
    try {
      //    await deleteTransaction(id);
      setFilteredTransactions(filteredTransactions.filter((t) => t.id !== id));
      toast.success(
        t("success.transaction_deleted") || "Transaction deleted successfully"
      );
    } catch (err) {
      console.error("Error in handleDelete:", err);
      toast.error(
        t("errors.delete_transaction_failed") || "Failed to delete transaction"
      );
    }
  };

  const months = [
    { value: "1", label: t("charts.months.jan") || "January" },
    { value: "2", label: t("charts.months.feb") || "February" },
    { value: "3", label: t("charts.months.mar") || "March" },
    { value: "4", label: t("charts.months.apr") || "April" },
    { value: "5", label: t("charts.months.may") || "May" },
    { value: "6", label: t("charts.months.jun") || "June" },
    { value: "7", label: t("charts.months.jul") || "July" },
    { value: "8", label: t("charts.months.aug") || "August" },
    { value: "9", label: t("charts.months.sep") || "September" },
    { value: "10", label: t("charts.months.oct") || "October" },
    { value: "11", label: t("charts.months.nov") || "November" },
    { value: "12", label: t("charts.months.dec") || "December" },
  ];

  return (
    <Card className="bg-[rgb(19,21,54)] border-none shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-white font-semibold">
            {t("recent_transactions") || "Recent Transactions"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="flex flex-col">
            <Label className="text-white mb-2">
              {t("charts.months") || "Month"}
            </Label>
            <select
              value={filters.month}
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value })
              }
              className="w-full bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 transition"
            >
              <option value="">{t("all") || "All"}</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <Label className="text-white mb-2">
              {t("amount") + " Mín." || "Min. Amount"}
            </Label>
            <Input
              type="number"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 transition"
              placeholder="0"
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-white mb-2">
              {t("amount") + " Máx." || "Max. Amount"}
            </Label>
            <Input
              type="number"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 transition"
              placeholder="0"
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-white mb-2">
              {t("date") + " Início" || "Start Date"}
            </Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-white mb-2">
              {t("date") + " Fim" || "End Date"}
            </Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[rgb(40,42,80)] hover:bg-[rgb(30,32,70)]">
              <TableHead className="text-gray-400 font-medium py-3">
                {t("date") || "Date"}
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                {t("description") || "Description"}
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                {t("amount") || "Amount"}
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                {t("type") || "Type"}
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="border-b border-[rgb(40,42,80)] hover:bg-[rgb(30,32,70)]"
              >
                <TableCell className="py-3">
                  {new Date(transaction.date).toLocaleDateString("pt-BR") ||
                    "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  {transaction.description || "N/A"}
                </TableCell>
                <TableCell
                  className={`py-3 ${
                    transaction.entryType === "C"
                      ? "text-green-400"
                      : "text-red-500"
                  }`}
                >
                  {typeof transaction.value === "number"
                    ? transaction.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  {t(
                    transaction.entryType === "C"
                      ? "last_incomes"
                      : "last_expenses"
                  ) || (transaction.entryType === "C" ? "Income" : "Expense")}
                </TableCell>
                <TableCell className="py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
