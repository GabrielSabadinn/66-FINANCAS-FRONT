import { useTranslation } from "react-i18next";
import { useState } from "react";
import { MiniStatisticsCard } from "../components/MiniStatisticsCard";
import { WelcomeCard } from "../components/WelcomeCard";
import { SatisfactionRateCard } from "../components/SatisfactionRateCard";
import { FinancialFreedomCard } from "../components/FinancialFreedomCard";
import { ChartCard } from "../components/ChartCard";
import { FinancialTransactionsTable } from "../components/ProjectsTable";
import TransactionTable from "@/components/TransactionTable";
import { Wallet, Globe, FileText, ShoppingCart } from "lucide-react";
import {
  getBarChartDataDashboard,
  getLineChartDataDashboard,
} from "@/variables/charts";

export default function Dashboard() {
  const { t } = useTranslation();
  const barData = getBarChartDataDashboard();
  const lineData = getLineChartDataDashboard();

  const [todayMoney, setTodayMoney] = useState(53000);
  const [futureMoney, setFutureMoney] = useState(200000);
  const [investmentsMoney, setInvestmentsMoney] = useState(3020);
  const [fixedCosts, setFixedCosts] = useState(173000);

  const handleAdd = (
    title: string,
    data: { description: string; amount: number; type?: "income" | "expense" }
  ) => {
    console.log(`Adicionando para ${title}:`, data);
    if (title === t("today_money")) {
      if (data.type === "income") {
        setTodayMoney((prev) => prev + data.amount);
      } else if (data.type === "expense") {
        setTodayMoney((prev) => prev - data.amount);
      }
    } else if (title === t("future_money")) {
      setFutureMoney((prev) => prev + data.amount);
    } else if (title === t("investments_money")) {
      setInvestmentsMoney((prev) => prev + data.amount);
    } else if (title === t("fixed_costs")) {
      setFixedCosts((prev) => prev + data.amount);
    }
  };

  return (
    <div
      className="flex flex-col pt-14 md:pt-16 text-white min-h-screen p-4 md:p-6"
      style={{
        background:
          "linear-gradient(90deg, rgba(71,5,138,1) 0%, rgba(22,10,33,1) 50%, rgba(71,5,138,1) 100%)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4 md:gap-4 md:mb-6">
        <MiniStatisticsCard
          title={t("today_money")}
          value={todayMoney}
          percentage="+55%"
          percentageColor="text-green-400"
          icon={Wallet}
          onAdd={(data) => handleAdd(t("today_money"), data)}
        />
        <MiniStatisticsCard
          title={t("future_money")}
          value={futureMoney}
          percentage="-2%"
          percentageColor="text-red-500"
          icon={Globe}
          onAdd={(data) => handleAdd(t("future_money"), data)}
        />
        <MiniStatisticsCard
          title={t("investments_money")}
          value={investmentsMoney}
          percentage="-14%"
          percentageColor="text-red-500"
          icon={FileText}
          onAdd={(data) => handleAdd(t("investments_money"), data)}
        />
        <MiniStatisticsCard
          title={t("fixed_costs")}
          value={fixedCosts}
          percentage="+8%"
          percentageColor="text-green-400"
          icon={ShoppingCart}
          onAdd={(data) => handleAdd(t("fixed_costs"), data)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr] gap-3 mb-4 md:gap-4 md:mb-6">
        <WelcomeCard t={t} />
        <SatisfactionRateCard t={t} />
        <FinancialFreedomCard
          t={t}
          moneySaved={6214}
          moneyGoal={10000}
          percentage={64}
        />
      </div>
      <div className="flex flex-col xl:flex-row gap-3 mb-4 md:gap-4 md:mb-6">
        <ChartCard
          t={t}
          type="line"
          title={t("data_by_month")}
          subtitle={
            <>
              <span className="text-green-500 font-bold">+5% {t("more")}</span>{" "}
              {t("in")} 2025
            </>
          }
          data={lineData}
        />
        <ChartCard
          t={t}
          type="bar"
          title={t("today_money")}
          subtitle={
            <>
              <span className="text-green-400 font-bold">+23%</span> {t("more")}{" "}
              {t("in")} {t("charts.months.apr")}
            </>
          }
          data={barData}
        />
      </div>
      <TransactionTable />
    </div>
  );
}
