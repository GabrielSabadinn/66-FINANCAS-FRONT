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
import { deleteTransaction } from "@/services/apiService";
import { FinancialTransaction } from "@/types";
import TableDialog from "@/components/TableDialog";
import RegisterDialog from "./RegisterDialog";

interface TransactionTableProps {
  transactions: FinancialTransaction[];
  title: string;
  register?: (data: {
    description: string;
    amount: number;
    type?: "income" | "expense";
  }) => void;
  hasButton: boolean;
  type: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  title,
  register,
  hasButton,
  type,
}) => {
  const { t } = useTranslation();
  const [filteredTransactions, setFilteredTransactions] =
    useState<FinancialTransaction[]>(transactions);
  const [filters, setFilters] = useState({
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    console.log("Received transactions:", transactions); // Debug log
    setFilteredTransactions(transactions);
  }, [transactions]);

  const filterTransactions = (t: FinancialTransaction) => {
    const date = new Date(t.Date);

    if (isNaN(date.getTime())) {
      console.warn(`Invalid date for transaction ${t.Id}: ${t.Date}`);
      return false;
    }
    const minAmountMatch = filters.minAmount
      ? t.Value >= parseFloat(filters.minAmount)
      : true;
    const maxAmountMatch = filters.maxAmount
      ? t.Value <= parseFloat(filters.maxAmount)
      : true;
    const startDateMatch = filters.startDate
      ? new Date(t.Date) >= new Date(filters.startDate)
      : true;
    const endDateMatch = filters.endDate
      ? new Date(t.Date) <= new Date(filters.endDate)
      : true;
    return minAmountMatch && maxAmountMatch && startDateMatch && endDateMatch;
  };

  const filtered = filteredTransactions.filter(filterTransactions);

  const handleDelete = async (id: number, data: string) => {
    try {
      const date: Date = new Date(data);

      console.log("Deleted transaction with ID:", id);

      await deleteTransaction(id, date);

      setFilteredTransactions(filteredTransactions.filter((t) => t.Id !== id));
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

  return (
    <Card className="bg-[rgb(19,21,54)] border-none shadow-lg rounded-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-white font-semibold">
            {title}
          </CardTitle>
          {
            hasButton ? <RegisterDialog
              onSave={register}
              initialData={{
                Id: 0,
                Value: 0,
                Date: "",
                Description: "",
                Created_at: "",
                UserId: 0,
                EntryId: 0,
                EntryType: "C",
              }}
              title={title}
            /> : <></>
          }
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-3 text-center text-gray-400"
                >
                  {t("no_transactions") || "No transactions found"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((transaction) => (
                <TableRow
                  key={transaction.Id}
                  className="border-b border-[rgb(40,42,80)] hover:bg-[rgb(30,32,70)]"
                >
                  <TableCell className="py-3">
                    {new Date(transaction.Date).toLocaleDateString("pt-BR") ||
                      "N/A"}
                  </TableCell>
                  <TableCell className="py-3">
                    {transaction.Description || "N/A"}
                  </TableCell>
                  <TableCell
                    className={`py-3 ${transaction.EntryType === "C"
                      ? "text-green-400"
                      : "text-red-500"
                      }`}
                  >
                    {typeof transaction.Value === "number"
                      ? transaction.Value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                      : "N/A"}
                  </TableCell>
                  <TableCell className="py-3">
                    {t(
                      transaction.EntryType === "C"
                        ? "last_incomes"
                        : "last_expenses"
                    ) || (transaction.EntryType === "C" ? "Income" : "Expense")}
                  </TableCell>
                  <TableCell className="py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.EntryId, transaction.Date)}
                      className="hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
