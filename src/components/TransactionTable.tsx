import React, { useState } from "react";
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

interface FinancialTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}

const mockTransactions: FinancialTransaction[] = [
  {
    id: 1,
    date: "2025-04-01",
    description: "Salário",
    amount: 5000,
    type: "income",
  },
  {
    id: 2,
    date: "2025-04-02",
    description: "Aluguel",
    amount: -1500,
    type: "expense",
  },
  {
    id: 3,
    date: "2025-04-03",
    description: "Supermercado",
    amount: -200,
    type: "expense",
  },
];

const TransactionTable: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] =
    useState<FinancialTransaction[]>(mockTransactions);
  const [filters, setFilters] = useState({
    month: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

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

  const handleSave = (item: FinancialTransaction, isEdit: boolean) => {
    if (isEdit) {
      setTransactions(transactions.map((t) => (t.id === item.id ? item : t)));
    } else {
      const id = transactions.length + 1;
      setTransactions([...transactions, { ...item, id }]);
    }
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-white">
            {t("recent_transactions")}
          </CardTitle>
          <TableDialog
            type="transaction"
            onSave={handleSave}
            initialData={{
              id: 0,
              date: "",
              description: "",
              amount: 0,
              type: "income",
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
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell
                  className={
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-500"
                  }
                >
                  {transaction.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  {t(
                    transaction.type === "income"
                      ? "last_incomes"
                      : "last_expenses"
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <TableDialog
                    type="transaction"
                    onSave={handleSave}
                    initialData={transaction}
                  />
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
