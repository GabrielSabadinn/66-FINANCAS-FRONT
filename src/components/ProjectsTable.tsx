import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle } from "lucide-react";
import { DashboardTableRow } from "./DashboardTableRow";
import {
  dashboardTableData,
  type DashboardTableRowData,
} from "@/variables/general";
import { useTranslation } from "react-i18next";

export const FinancialTransactionsTable: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Card className="p-4 bg-[rgb(19,21,54)] border-none overflow-x-auto">
      <CardHeader className="p-3 pb-7">
        <div className="flex flex-col">
          <p className="text-lg text-white font-bold pb-2">
            {t("recent_transactions")}
          </p>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-violet-400 mr-1" />
            <p className="text-sm text-gray-400">
              <span className="font-bold">
                {t("total_transactions", { count: 30 })}
              </span>{" "}
              {t("this_month")}
            </p>
          </div>
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <th className="py-2 px-0">{t("last_expenses")}</th>
            <th className="py-2">{t("last_incomes")}</th>
            <th className="py-2">{t("date")}</th>
            <th className="py-2">{t("amount")}</th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dashboardTableData.map(
            (
              row: DashboardTableRowData,
              index: number,
              arr: DashboardTableRowData[]
            ) => (
              <DashboardTableRow
                key={index}
                name={row.name}
                logo={row.logo}
                members={row.members}
                budget={row.budget}
                progression={row.progression}
                lastItem={index === arr.length - 1}
              />
            )
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
