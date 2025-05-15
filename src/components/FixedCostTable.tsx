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
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(mockFixedCosts);
  const [filters, setFilters] = useState({
    month: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

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

  const handleSave = (item: FixedCost, isEdit: boolean) => {
    if (isEdit) {
      setFixedCosts(fixedCosts.map((f) => (f.id === item.id ? item : f)));
    } else {
      const id = fixedCosts.length + 1;
      setFixedCosts([...fixedCosts, { ...item, id }]);
    }
  };

  const handleDelete = (id: number) => {
    setFixedCosts(fixedCosts.filter((f) => f.id !== id));
  };

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl text-white">
            {t("fixed_costs")}
          </CardTitle>
          {/*           <TableDialog
            type="fixedCost"
            onSave={handleSave}
            initialData={{ id: 0, description: "", amount: 0, dueDate: "" }}
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
              <TableHead className="text-gray-400">
                {t("description")}
              </TableHead>
              <TableHead className="text-gray-400">{t("amount")}</TableHead>
              <TableHead className="text-gray-400">{t("date")}</TableHead>
              <TableHead className="text-gray-400"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFixedCosts.map((cost) => (
              <TableRow
                key={cost.id}
                className="border-b border-[rgb(40,42,80)]"
              >
                <TableCell>{cost.description}</TableCell>
                <TableCell className="text-red-500">
                  {cost.amount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>{cost.dueDate}</TableCell>
                <TableCell className="flex gap-2">
                  {/*      <TableDialog
                    type="fixedCost"
                    onSave={handleSave}
                    initialData={cost}
                  /> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cost.id)}
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

export default FixedCostTable;
