// components/InvestmentTable.tsx
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
import TableDialogue from "@/components/TableDialog";
import { useAuth } from "@/context/AuthContext";
import { investmentService } from "@/services/investmentService";
import { authService } from "@/services/authService";
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

const InvestmentTable: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout, validateToken } = useAuth();
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
  // components/InvestmentTable.tsx
  // components/InvestmentTable.tsx
  useEffect(() => {
    const fetchUserAndInvestments = async () => {
      console.log(
        "Starting fetchUserAndInvestments, isAuthenticated:",
        isAuthenticated
      );
      if (!isAuthenticated) {
        console.log("User not authenticated");
        setError("User not authenticated");
        setLoading(false);
        return;
      }

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
        const userId = parseInt(storedUserId, 10);
        console.log("Parsed userId:", userId);
        setUserId(userId);

        console.log("Fetching investments...");
        const fetchedInvestments = await investmentService.getAllInvestments(
          accessToken
        );
        console.log("Fetched investments:", fetchedInvestments);
        setInvestments(fetchedInvestments);
        setLoading(false);
      } catch (err: any) {
        console.error("Error in fetchUserAndInvestments:", err);
        setError(err.message || "Failed to fetch investments");
        setLoading(false);
        if (err.message.includes("Invalid or expired token")) {
          console.log("Logging out due to invalid token");
          logout();
        }
      }
    };

    fetchUserAndInvestments();
  }, [isAuthenticated, validateToken, logout]);
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
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || !userId) {
        throw new Error("Not authenticated");
      }

      const payload = { ...item, UserId: userId };
      console.log("Saving investment, payload:", payload);
      if (isEdit && item.id) {
        const updatedInvestment = await investmentService.updateInvestment(
          item.id,
          payload,
          accessToken
        );
        console.log("Updated investment:", updatedInvestment);
        setInvestments(
          investments.map((i) => (i.id === item.id ? updatedInvestment : i))
        );
      } else {
        const newInvestment = await investmentService.createInvestment(
          payload,
          accessToken
        );
        console.log("Created investment:", newInvestment);
        setInvestments([...investments, newInvestment]);
      }
    } catch (err: any) {
      console.error("Error saving investment:", err);
      setError(err.message || "Failed to save investment");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || !userId) {
        throw new Error("Not authenticated");
      }

      console.log("Deleting investment with id:", id);
      await investmentService.deleteInvestment(id, accessToken);
      console.log("Investment deleted successfully");
      setInvestments(investments.filter((i) => i.id !== id));
    } catch (err: any) {
      console.error("Error deleting investment:", err);
      setError(err.message || "Failed to delete investment");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-white">
            {t("investments_money")}
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
                        ).indexOf(key),
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
              <TableHead className="text-gray-400">Retorno (%)</TableHead>
              <TableHead className="text-gray-400"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvestments.map((investment) => (
              <TableRow
                key={investment.id}
                className="border-b border-[rgb(40,42,80)]"
              >
                <TableCell>{investment.Date}</TableCell>
                <TableCell>
                  {investment.CategoryName || investment.Description}
                </TableCell>
                <TableCell className="text-green-400">
                  {investment.Amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>{investment.ReturnPercentage}%</TableCell>
                <TableCell className="flex gap-2">
                  <TableDialogue
                    type="investment"
                    onSave={handleSave}
                    initialData={investment}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(investment.id)}
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

export default InvestmentTable;
