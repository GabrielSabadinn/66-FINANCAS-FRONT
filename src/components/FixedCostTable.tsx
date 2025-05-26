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
import TableDialog from "@/components/TableDialog";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface FixedCost {
  id: number;
  description: string;
  amount: number;
  dueDate: string;
}

const mockFixedCosts: FixedCost[] = [
  { id: 1, description: "Aluguel", amount: 1500, dueDate: "2025-04-05" },
  { id: 2, description: "Internet", amount: 100, dueDate: "2025-04-10" },
];

const FixedCostTable: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
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
    if (isAuthenticated) {
      fetchFixedCosts();
    }
  }, [isAuthenticated]);

  const fetchFixedCosts = async () => {
    console.log("Starting fetchFixedCosts, isAuthenticated:", isAuthenticated);
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
      console.log("Fetching mocked fixed costs...");

      // Filter fixed costs (mock assumes all costs are for the user, as no UserId field exists)
      const validFixedCosts = mockFixedCosts.filter(
        (cost) =>
          cost.id != null &&
          cost.amount != null &&
          cost.dueDate != null &&
          cost.description != null
      );

      if (validFixedCosts.length !== mockFixedCosts.length) {
        toast.warn(
          t("warnings.invalid_fixed_costs_filtered", {
            count: mockFixedCosts.length - validFixedCosts.length,
          }) ||
          `Filtered out ${mockFixedCosts.length - validFixedCosts.length
          } invalid fixed costs`
        );
      }
      setFixedCosts(validFixedCosts);
      setError(null);
    } catch (err) {
      console.error("Error in fetchFixedCosts:", err);
      const error = err as Error;
      if (error.message === "No user ID found in localStorage") {
        console.log("Logging out due to missing user ID");
        logout();
      }
      setError(
        t("errors.fetch_fixed_costs_failed") || "Failed to fetch fixed costs"
      );
      toast.error(
        t("errors.fetch_fixed_costs_failed") || "Failed to fetch fixed costs"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterFixedCosts = (f: FixedCost) => {
    const date = new Date(f.dueDate);
    const monthMatch = filters.month
      ? date.getMonth() + 1 === parseInt(filters.month)
      : true;
    const minAmountMatch = filters.minAmount
      ? f.amount >= parseFloat(filters.minAmount)
      : true;
    const maxAmountMatch = filters.maxAmount
      ? f.amount <= parseFloat(filters.maxAmount)
      : true;
    const startDateMatch = filters.startDate
      ? new Date(f.dueDate) >= new Date(filters.startDate)
      : true;
    const endDateMatch = filters.endDate
      ? new Date(f.dueDate) <= new Date(filters.endDate)
      : true;
    return (
      monthMatch &&
      minAmountMatch &&
      maxAmountMatch &&
      startDateMatch &&
      endDateMatch
    );
  };

  const filteredFixedCosts = fixedCosts.filter(filterFixedCosts);

  const handleSave = async (item: Partial<FixedCost>, isEdit: boolean) => {
    try {
      if (!userId) {
        throw new Error(t("errors.not_authenticated") || "Not authenticated");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const payload: FixedCost = {
        id:
          isEdit && item.id
            ? item.id
            : fixedCosts.length
              ? Math.max(...fixedCosts.map((f) => f.id)) + 1
              : 1,
        description: item.description || "Unnamed Cost",
        amount: item.amount || 0,
        dueDate: item.dueDate || new Date().toISOString().split("T")[0],
      };
      console.log("Saving fixed cost, payload:", payload);

      if (isEdit && item.id) {
        console.log("Updated fixed cost:", payload);
        setFixedCosts(fixedCosts.map((f) => (f.id === item.id ? payload : f)));
        toast.success(
          t("success.fixed_cost_updated") || "Fixed cost updated successfully"
        );
      } else {
        console.log("Created fixed cost:", payload);
        setFixedCosts([...fixedCosts, payload]);
        toast.success(
          t("success.fixed_cost_created") || "Fixed cost created successfully"
        );
      }
      setError(null);
    } catch (err: any) {
      console.error("Error saving fixed cost:", err);
      setError(
        err.message ||
        t("errors.save_fixed_cost_failed") ||
        "Failed to save fixed cost"
      );
      toast.error(
        t("errors.save_fixed_cost_failed") || "Failed to save fixed cost"
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
      console.log("Deleting fixed cost with id:", id);
      setFixedCosts(fixedCosts.filter((f) => f.id !== id));
      console.log("Fixed cost deleted successfully");
      toast.success(
        t("success.fixed_cost_deleted") || "Fixed cost deleted successfully"
      );
      setError(null);
    } catch (err: any) {
      console.error("Error deleting fixed cost:", err);
      setError(
        err.message ||
        t("errors.delete_fixed_cost_failed") ||
        "Failed to delete fixed cost"
      );
      toast.error(
        t("errors.delete_fixed_cost_failed") || "Failed to delete fixed cost"
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
            {t("fixed_costs") || "Fixed Costs"}
          </CardTitle>
          <TableDialog
            type="fixedCost"
            onSave={handleSave}
            initialData={{ id: 0, description: "", amount: 0, dueDate: "" }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* <div className="flex flex-col">
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
          </div> */}
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
                {t("description") || "Description"}
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                {t("amount") || "Amount"}
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                {t("date") || "Due Date"}
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFixedCosts.map((cost) => (
              <TableRow
                key={cost.id}
                className="border-b border-[rgb(40,42,80)] hover:bg-[rgb(30,32,70)]"
              >
                <TableCell className="py-3">
                  {cost.description || "N/A"}
                </TableCell>
                <TableCell className="text-red-500 py-3">
                  {typeof cost.amount === "number"
                    ? cost.amount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                    : "N/A"}
                </TableCell>
                <TableCell className="py-3">{cost.dueDate || "N/A"}</TableCell>
                <TableCell className="py-3">
                  <div className="flex gap-2">
                    <TableDialog
                      type="fixedCost"
                      onSave={handleSave}
                      initialData={cost}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cost.id)}
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

export default FixedCostTable;
