import { useTranslation } from "react-i18next";
import { MiniStatisticsCard } from "../components/MiniStatisticsCard";
import { WelcomeCard } from "../components/WelcomeCard";
import { SatisfactionRateCard } from "../components/SatisfactionRateCard";
import { FinancialFreedomCard } from "../components/FinancialFreedomCard";
import { ChartCard } from "../components/ChartCard";
import { ProjectsTable } from "../components/ProjectsTable";
import { Wallet, Globe, FileText, ShoppingCart } from "lucide-react";
import {
  getBarChartDataDashboard,
  getLineChartDataDashboard,
} from "@/variables/charts";

export default function Dashboard() {
  const { t } = useTranslation();
  const barData = getBarChartDataDashboard();
  const lineData = getLineChartDataDashboard();

  return (
    <div
      className="flex flex-col pt-14 md:pt-16 text-white min-h-screen p-4 md:p-6"
      style={{
        background:
          "linear-gradient(90deg, rgba(71,5,138,1) 0%, rgba(22,10,33,1) 50%, rgba(71,5,138,1) 100%)",
      }}
    >
      {/* MiniStatistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4 md:gap-4 md:mb-6">
        <MiniStatisticsCard
          title={t("today_money")}
          value={53000}
          percentage="+55%"
          percentageColor="text-green-400"
          icon={Wallet}
        />
        <MiniStatisticsCard
          title={t("future_money")}
          value={200000}
          percentage="-2%"
          percentageColor="text-red-500"
          icon={Globe}
        />
        <MiniStatisticsCard
          title={t("investments_money")}
          value={3020}
          percentage="-14%"
          percentageColor="text-red-500"
          icon={FileText}
        />
        <MiniStatisticsCard
          title={t("fixed_costs")}
          value={173000}
          percentage="+8%"
          percentageColor="text-green-400"
          icon={ShoppingCart}
        />
      </div>

      {/* Main Grid */}
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

      {/* Charts */}
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

      {/* Projects Table */}
      <ProjectsTable />
    </div>
  );
}
