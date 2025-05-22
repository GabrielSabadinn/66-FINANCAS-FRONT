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
import { Pencil, Trash2 } from "lucide-react";
import TableDialog from "@/components/TableDialog";
import { transactionService } from "@/services/transactionService";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

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

const TransactionTable: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout, validateToken } = useAuth();
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
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Validating token...");
      await validateToken();
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access token:", accessToken ? "Present" : "Missing");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const storedUserId = localStorage.getItem("userId");
      console.log("Stored userId:", storedUserId);
      if (!storedUserId) {
        throw new Error("No user ID found in localStorage");
      }
      const parsedUserId = parseInt(storedUserId, 10);
      console.log("Parsed userId:", parsedUserId);
      setUserId(parsedUserId);

      console.log("Fetching transactions...");
      const data = await transactionService.getAllTransactions(
        accessToken,
        parsedUserId
      );
      console.log("Fetched transactions:", data);

      // Transform API response
      const validTransactions: FinancialTransaction[] = data
        .map((transaction: any) => ({
          id: transaction.Id,
          userId: transaction.UserId,
          categoryId: transaction.CategoryId,
          date: new Date(transaction.Date).toISOString().split("T")[0],
          description: transaction.Description || "",
          amount: transaction.Amount ?? 0,
          type: transaction.Type ?? "income",
        }))
        .filter(
          (transaction: FinancialTransaction) =>
            transaction.id != null &&
            transaction.amount != null &&
            transaction.date != null &&
            transaction.type != null &&
            transaction.categoryId != null &&
            transaction.userId != null
        );

      if (validTransactions.length !== data.length) {
        toast.warn(
          `Filtered out ${
            data.length - validTransactions.length
          } invalid transactions`
        );
      }
      setTransactions(validTransactions);
      setError(null);
    } catch (err) {
      console.error("Error in fetchTransactions:", err);
      const error = err as Error | AxiosError;
      if (
        error.message === "No access token found" ||
        error.message.includes("Invalid or expired token")
      ) {
        console.log("Logging out due to token issue");
        logout();
      } else if (
        error instanceof AxiosError &&
        error.response?.status === 401
      ) {
        console.log("Logging out due to 401 error");
        logout();
      }
      setError(t("errors.fetch_transactions_failed"));
      toast.error(t("errors.fetch_transactions_failed"));
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
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      if (isEdit) {
        const updatedTransaction = await transactionService.updateTransaction(
          transactionItem.id,
          {
            date: transactionItem.date,
            description: transactionItem.description,
            amount: transactionItem.amount,
            type: transactionItem.type,
            categoryId: transactionItem.categoryId,
          },
          accessToken
        );
        setTransactions(
          transactions.map((t) =>
            t.id === transactionItem.id ? updatedTransaction : t
          )
        );
        toast.success(t("success.transaction_updated"));
      } else {
        const newTransaction = await transactionService.createTransaction(
          {
            date: transactionItem.date,
            description: transactionItem.description,
            amount: transactionItem.amount,
            type: transactionItem.type,
            categoryId: transactionItem.categoryId,
            userId: userId || 0, // Use stored userId
          },
          accessToken
        );
        setTransactions([...transactions, newTransaction]);
        toast.success(t("success.transaction_created"));
      }
      setError(null);
    } catch (err) {
      console.error("Error in handleSave:", err);
      const error = err as Error | AxiosError;
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log("Logging out due to 401 error");
        logout();
      }
      setError(t("errors.save_transaction_failed"));
      toast.error(t("errors.save_transaction_failed"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      await transactionService.deleteTransaction(id, accessToken);
      setTransactions(transactions.filter((t) => t.id !== id));
      setError(null);
      toast.success(t("success.transaction_deleted"));
    } catch (err) {
      console.error("Error in handleDelete:", err);
      const error = err as Error | AxiosError;
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.log("Logging out due to 401 error");
        logout();
      }
      setError(t("errors.delete_transaction_failed"));
      toast.error(t("errors.delete_transaction_failed"));
    }
  };

  if (loading) {
    return <div className="text-white">{t("loading")}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-white">
            {t("recent_transactions")}
          </CardTitle>
          {/* Uncomment and update TableDialog if needed */}
          {/* <TableDialog
            type="transaction"
            onSave={handleSave}
            initialData={{
              id: 0,
              date: "",
              description: "",
              amount: 0,
              type: "income",
              categoryId: 1,
              userId: userId || 0,
            }}
          /> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
          <div>
            <Label className="text-white">{t("charts.months")}</Label>
            <select
              value={filters.month}
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value })
              }
              className="w-full bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded"
            >
              <option value="">{t("all")}</option>
              {Object.entries(t("charts.months", { returnObjects: true })).map(
                ([key, value]) => (
                  <option
                    key={key}
                    value={String(
                      new Date(
                        2025,
                        Object.keys(
                          t("charts.months", { returnObjects: true })
                        ).indexOf(key) + 1,
                        1
                      ).getMonth() + 1
                    )}
                  >
                    {value}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <Label className="text-white">{t("amount")} Mín.</Label>
            <Input
              type="number"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
            />
          </div>
          <div>
            <Label className="text-white">{t("amount")} Máx.</Label>
            <Input
              type="number"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
            />
          </div>
          <div>
            <Label className="text-white">{t("date")} Início</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
            />
          </div>
          <div>
            <Label className="text-white">{t("date")} Fim</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[rgb(40,42,80)]">
              <TableHead className="text-gray-400">{t("date")}</TableHead>
              <TableHead className="text-gray-400">
                {t("description")}
              </TableHead>
              <TableHead className="text-gray-400">{t("amount")}</TableHead>
              <TableHead className="text-gray-400">{t("type")}</TableHead>
              <TableHead className="text-gray-400"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="border-b border-[rgb(40,42,80)]"
              >
                <TableCell>{transaction.date || "N/A"}</TableCell>
                <TableCell>{transaction.description || "N/A"}</TableCell>
                <TableCell
                  className={
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-500"
                  }
                >
                  {typeof transaction.amount === "number"
                    ? transaction.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {t(
                    transaction.type === "income"
                      ? "last_incomes"
                      : "last_expenses"
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  {/* Uncomment and update TableDialog if needed */}
                  {/* <TableDialog
                    type="transaction"
                    onSave={handleSave}
                    initialData={transaction}
                  /> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
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
