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

interface Investment {
  id: number;
  date: string;
  description: string;
  amount: number;
  returnRate: number;
}

const mockInvestments: Investment[] = [
  {
    id: 1,
    date: "2025-01-15",
    description: "Tesouro Direto",
    amount: 1000,
    returnRate: 5.5,
  },
  {
    id: 2,
    date: "2025-02-20",
    description: "Ações B3",
    amount: 2000,
    returnRate: 8.0,
  },
];

const InvestmentTable: React.FC = () => {
  const { t } = useTranslation();
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [filters, setFilters] = useState({
    month: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  const filterInvestments = (i: Investment) => {
    const date = new Date(i.date);
    const monthMatch = filters.month
      ? date.getMonth() + 1 === parseInt(filters.month)
      : true;
    const minAmountMatch = filters.minAmount
      ? i.amount >= parseFloat(filters.minAmount)
      : true;
    const maxAmountMatch = filters.maxAmount
      ? i.amount <= parseFloat(filters.maxAmount)
      : true;
    const startDateMatch = filters.startDate
      ? new Date(i.date) >= new Date(filters.startDate)
      : true;
    const endDateMatch = filters.endDate
      ? new Date(i.date) <= new Date(filters.endDate)
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

  const handleSave = (item: Investment, isEdit: boolean) => {
    if (isEdit) {
      setInvestments(investments.map((i) => (i.id === item.id ? item : i)));
    } else {
      const id = investments.length + 1;
      setInvestments([...investments, { ...item, id }]);
    }
  };

  const handleDelete = (id: number) => {
    setInvestments(investments.filter((i) => i.id !== id));
  };

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-white">
            {t("investments_money")}
          </CardTitle>
          {/*   <TableDialog
            type="investment"
            onSave={handleSave}
            initialData={{
              id: 0,
              date: "",
              description: "",
              amount: 0,
              returnRate: 0,
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
                <TableCell>{investment.date}</TableCell>
                <TableCell>{investment.description}</TableCell>
                <TableCell className="text-green-400">
                  {investment.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>{investment.returnRate}%</TableCell>
                <TableCell className="flex gap-2">
                  {/*      <TableDialog
                    type="investment"
                    onSave={handleSave}
                    initialData={investment}
                  /> */}
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
