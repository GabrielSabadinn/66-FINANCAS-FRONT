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
import TableDialogue from "@/components/TableDialog";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

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

// Mocked data
const mockInvestments: Investment[] = [
  {
    id: 1,
    UserId: 1,
    CategoryId: 1,
    CategoryName: "Stocks",
    Date: "2025-05-01",
    Description: "Tech Stock Investment",
    Amount: 10000,
    ReturnPercentage: 5.2,
    CreatedAt: "2025-05-01T10:00:00Z",
    UpdatedAt: "2025-05-01T10:00:00Z",
  },
  {
    id: 2,
    UserId: 1,
    CategoryId: 2,
    CategoryName: "Bonds",
    Date: "2025-05-03",
    Description: "Government Bonds",
    Amount: 5000,
    ReturnPercentage: 3.8,
    CreatedAt: "2025-05-03T12:00:00Z",
    UpdatedAt: "2025-05-03T12:00:00Z",
  },
  {
    id: 3,
    UserId: 1,
    CategoryId: 3,
    CategoryName: "Real Estate",
    Date: "2025-05-05",
    Description: "Property Fund",
    Amount: 15000,
    ReturnPercentage: 6.5,
    CreatedAt: "2025-05-05T14:00:00Z",
    UpdatedAt: "2025-05-05T14:00:00Z",
  },
];

const InvestmentTable: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    month: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchUserAndInvestments = async () => {
      console.log(
        "Starting fetchUserAndInvestments, isAuthenticated:",
        isAuthenticated
      );
      if (!isAuthenticated) {
        console.log("User not authenticated");
        setError(
          t("errors.user_not_authenticated") || "User not authenticated"
        );
        setLoading(false);
        return;
      }

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
        console.log("Fetching mocked investments...");

        // Filter investments by UserId to simulate server-side filtering
        const fetchedInvestments = mockInvestments.filter(
          (investment) =>
            investment.UserId === parsedUserId &&
            investment.id != null &&
            investment.Amount != null &&
            investment.Date != null &&
            investment.ReturnPercentage != null &&
            investment.CategoryId != null
        );

        console.log("Fetched investments:", fetchedInvestments);
        setInvestments(fetchedInvestments);
        setLoading(false);
        setError(null);
      } catch (err: any) {
        console.error("Error in fetchUserAndInvestments:", err);
        setError(
          err.message ||
            t("errors.fetch_investments_failed") ||
            "Failed to fetch investments"
        );
        setLoading(false);
        if (err.message === "No user ID found in localStorage") {
          console.log("Logging out due to missing user ID");
          logout();
        }
        toast.error(
          t("errors.fetch_investments_failed") || "Failed to fetch investments"
        );
      }
    };

    fetchUserAndInvestments();
  }, [isAuthenticated, logout]);

  const filterInvestments = (i: Investment) => {
    const date = new Date(i.Date);
    const monthMatch = filters.month
      ? date.getMonth() + 1 === parseInt(filters.month)
      : true;
    const minAmountMatch = filters.minAmount
      ? i.Amount >= parseFloat(filters.minAmount)
      : true;
    const maxAmountMatch = filters.maxAmount
      ? i.Amount <= parseFloat(filters.maxAmount)
      : true;
    const startDateMatch = filters.startDate
      ? new Date(i.Date) >= new Date(filters.startDate)
      : true;
    const endDateMatch = filters.endDate
      ? new Date(i.Date) <= new Date(filters.endDate)
      : true;
    return (
      monthMatch &&
      minAmountMatch &&
      maxAmountMatch &&
      startDateMatch &&
      endDateMatch
    );
  };

  const filteredInvestments = investments.filter(filterInvestments);

  const handleSave = async (item: Partial<Investment>, isEdit: boolean) => {
    try {
      if (!userId) {
        throw new Error(t("errors.not_authenticated") || "Not authenticated");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const currentDate = new Date().toISOString();
      const payload: Investment = {
        id:
          isEdit && item.id
            ? item.id
            : investments.length
            ? Math.max(...investments.map((i) => i.id)) + 1
            : 1,
        UserId: userId,
        CategoryId: item.CategoryId || 1,
        CategoryName: item.CategoryName || "General",
        Date: item.Date || new Date().toISOString().split("T")[0],
        Description: item.Description || null,
        Amount: item.Amount || 0,
        ReturnPercentage: item.ReturnPercentage || 0,
        CreatedAt: isEdit ? item.CreatedAt || currentDate : currentDate,
        UpdatedAt: currentDate,
      };
      console.log("Saving investment, payload:", payload);

      if (isEdit && item.id) {
        console.log("Updated investment:", payload);
        setInvestments(
          investments.map((i) => (i.id === item.id ? payload : i))
        );
        toast.success(
          t("success.investment_updated") || "Investment updated successfully"
        );
      } else {
        console.log("Created investment:", payload);
        setInvestments([...investments, payload]);
        toast.success(
          t("success.investment_created") || "Investment created successfully"
        );
      }
      setError(null);
    } catch (err: any) {
      console.error("Error saving investment:", err);
      setError(
        err.message ||
          t("errors.save_investment_failed") ||
          "Failed to save investment"
      );
      toast.error(
        t("errors.save_investment_failed") || "Failed to save investment"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!userId) {
        throw new Error(t("errors.not_authenticated") || "Not authenticated");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Deleting investment with id:", id);
      setInvestments(investments.filter((i) => i.id !== id));
      console.log("Investment deleted successfully");
      toast.success(
        t("success.investment_deleted") || "Investment deleted successfully"
      );
      setError(null);
    } catch (err: any) {
      console.error("Error deleting investment:", err);
      setError(
        err.message ||
          t("errors.delete_investment_failed") ||
          "Failed to delete investment"
      );
      toast.error(
        t("errors.delete_investment_failed") || "Failed to delete investment"
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
            {t("investments_money") || "Investments"}
          </CardTitle>
          <TableDialogue
            type="investment"
            onSave={handleSave}
            initialData={{
              id: 0,
              Date: "",
              Description: "",
              Amount: 0,
              ReturnPercentage: 0,
              CategoryId: 0,
              CategoryName: "",
              UserId: userId || 0,
              CreatedAt: "",
              UpdatedAt: "",
            }}
          />
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
                Retorno (%)
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvestments.map((investment) => (
              <TableRow
                key={investment.id}
                className="border-b border-[rgb(40,42,80)] hover:bg-[rgb(30,32,70)]"
              >
                <TableCell className="py-3">
                  {investment.Date || "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  {investment.CategoryName || investment.Description || "N/A"}
                </TableCell>
                <TableCell className="text-green-400 py-3">
                  {typeof investment.Amount === "number"
                    ? investment.Amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  {typeof investment.ReturnPercentage === "number"
                    ? `${investment.ReturnPercentage}%`
                    : "N/A"}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex gap-2">
                    <TableDialogue
                      type="investment"
                      onSave={handleSave}
                      initialData={investment}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(investment.id)}
                      className="hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InvestmentTable;
