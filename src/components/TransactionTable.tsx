import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/context/AuthContext";

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

// Mocked data
const mockTransactions: FinancialTransaction[] = [
  {
    id: 1,
    date: "2025-05-01",
    description: "Salary",
    amount: 5000,
    type: "income",
    categoryId: 1,
    userId: 1,
  },
  {
    id: 2,
    date: "2025-05-02",
    description: "Rent",
    amount: 1500,
    type: "expense",
    categoryId: 2,
    userId: 1,
  },
  {
    id: 3,
    date: "2025-05-03",
    description: "Groceries",
    amount: 200,
    type: "expense",
    categoryId: 3,
    userId: 1,
  },
];

const TransactionTable: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    month: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const fetchTransactions = async () => {
    console.log(
      "Starting fetchTransactions, isAuthenticated:",
      isAuthenticated
    );
    if (!isAuthenticated) {
      console.log("User not authenticated");
      setError(t("errors.user_not_authenticated") || "User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const storedUserId = localStorage.getItem("userId");
      console.log("Stored userId:", storedUserId);
      if (!storedUserId) {
        throw new Error("No user ID found in localStorage");
      }
      const parsedUserId = parseInt(storedUserId, 10);
      console.log("Parsed userId:", parsedUserId);
      setUserId(parsedUserId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Fetching mocked transactions...");

      // Filter transactions by userId to simulate server-side filtering
      const validTransactions = mockTransactions.filter(
        (transaction) =>
          transaction.userId === parsedUserId &&
          transaction.id != null &&
          transaction.amount != null &&
          transaction.date != null &&
          transaction.type != null &&
          transaction.categoryId != null
      );

      if (validTransactions.length !== mockTransactions.length) {
        toast.warn(
          t("warnings.invalid_transactions_filtered", {
            count: mockTransactions.length - validTransactions.length,
          }) ||
            `Filtered out ${
              mockTransactions.length - validTransactions.length
            } invalid transactions`
        );
      }
      setTransactions(validTransactions);
      setError(null);
    } catch (err) {
      console.error("Error in fetchTransactions:", err);
      const error = err as Error;
      if (error.message === "No user ID found in localStorage") {
        console.log("Logging out due to missing user ID");
        logout();
      }
      setError(
        t("errors.fetch_transactions_failed") || "Failed to fetch transactions"
      );
      toast.error(
        t("errors.fetch_transactions_failed") || "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = (t: FinancialTransaction) => {
    const date = new Date(t.date);
    const monthMatch = filters.month
      ? date.getMonth() + 1 === parseInt(filters.month)
      : true;
    const minAmountMatch = filters.minAmount
      ? t.amount >= parseFloat(filters.minAmount)
      : true;
    const maxAmountMatch = filters.maxAmount
      ? t.amount <= parseFloat(filters.maxAmount)
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

  const filteredTransactions = transactions.filter(filterTransactions);

  const handleSave = async (
    item: FinancialTransaction | Investment | FixedCost,
    isEdit: boolean
  ) => {
    try {
      const transactionItem = item as FinancialTransaction;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isEdit) {
        const updatedTransaction = { ...transactionItem };
        setTransactions(
          transactions.map((t) =>
            t.id === transactionItem.id ? updatedTransaction : t
          )
        );
        toast.success(
          t("success.transaction_updated") || "Transaction updated successfully"
        );
      } else {
        const newTransaction = {
          ...transactionItem,
          id: transactions.length
            ? Math.max(...transactions.map((t) => t.id)) + 1
            : 1,
          userId: userId || 0,
        };
        setTransactions([...transactions, newTransaction]);
        toast.success(
          t("success.transaction_created") || "Transaction created successfully"
        );
      }
      setError(null);
    } catch (err) {
      console.error("Error in handleSave:", err);
      setError(
        t("errors.save_transaction_failed") || "Failed to save transaction"
      );
      toast.error(
        t("errors.save_transaction_failed") || "Failed to save transaction"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTransactions(transactions.filter((t) => t.id !== id));
      setError(null);
      toast.success(
        t("success.transaction_deleted") || "Transaction deleted successfully"
      );
    } catch (err) {
      console.error("Error in handleDelete:", err);
      setError(
        t("errors.delete_transaction_failed") || "Failed to delete transaction"
      );
      toast.error(
        t("errors.delete_transaction_failed") || "Failed to delete transaction"
      );
    }
  };

  // Define months array to avoid reliance on t("charts.months") directly
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

  if (loading) {
    return (
      <div className="text-white text-center py-4">
        {t("loading") || "Loading..."}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

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
            {filteredTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="border-b border-[rgb(40,42,80)] hover:bg-[rgb(30,32,70)]"
              >
                <TableCell className="py-3">
                  {transaction.date || "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  {transaction.description || "N/A"}
                </TableCell>
                <TableCell
                  className={`py-3 ${
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-500"
                  }`}
                >
                  {typeof transaction.amount === "number"
                    ? transaction.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  {t(
                    transaction.type === "income"
                      ? "last_incomes"
                      : "last_expenses"
                  ) || (transaction.type === "income" ? "Income" : "Expense")}
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
