import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { MiniStatisticsCard } from "../components/MiniStatisticsCard";
import { WelcomeCard } from "../components/WelcomeCard";
import { SatisfactionRateCard } from "../components/SatisfactionRateCard";
import { FinancialFreedomCard } from "../components/FinancialFreedomCard";
import { ChartCard } from "../components/ChartCard";
import TransactionTable from "@/components/TransactionTable";
import { Wallet, Globe, FileText, ShoppingCart } from "lucide-react";
import {
  getBarChartDataDashboard,
  getLineChartDataDashboard,
} from "@/variables/charts";

import { useAuth } from "@/context/AuthContext";
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

// Mocked data
const mockTransactions: FinancialTransaction[] = [
  {
    id: 1,
    date: "2025-05-01",
    description: "Salary",
    amount: 5000,
    type: "income",
    categoryId: 1,
    userId: 1,
  },
  {
    id: 2,
    date: "2025-05-02",
    description: "Rent",
    amount: 1500,
    type: "expense",
    categoryId: 2,
    userId: 1,
  },
  {
    id: 3,
    date: "2025-05-03",
    description: "Groceries",
    amount: 200,
    type: "expense",
    categoryId: 3,
    userId: 1,
  },
  {
    id: 4,
    date: "2025-05-04",
    description: "Investment",
    amount: 1000,
    type: "expense",
    categoryId: 4,
    userId: 1,
  },
  {
    id: 5,
    date: "2025-05-05",
    description: "Utility Bill",
    amount: 300,
    type: "expense",
    categoryId: 5,
    userId: 1,
  },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const barData = getBarChartDataDashboard();
  const lineData = getLineChartDataDashboard();

  const [todayMoney, setTodayMoney] = useState(0);
  const [futureMoney, setFutureMoney] = useState(200000);
  const [investmentsMoney, setInvestmentsMoney] = useState(3020);
  const [fixedCosts, setFixedCosts] = useState(173000);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const fetchTransactions = async () => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Fetching mocked transactions...");

      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        throw new Error("No user ID found in localStorage");
      }
      const parsedUserId = parseInt(storedUserId, 10);

      // Filter transactions by userId to simulate server-side filtering
      const validTransactions: FinancialTransaction[] = mockTransactions.filter(
        (transaction) =>
          transaction.userId === parsedUserId &&
          transaction.id != null &&
          transaction.amount != null &&
          transaction.date != null &&
          transaction.type != null &&
          transaction.categoryId != null
      );

      setTransactions(validTransactions);

      // Calculate todayMoney
      const balance = validTransactions.reduce((sum, transaction) => {
        return transaction.type === "income"
          ? sum + transaction.amount
          : sum - transaction.amount;
      }, 0);
      setTodayMoney(balance);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      const error = err as Error;
      if (error.message === "No user ID found in localStorage") {
        logout();
      }
      toast.error(t("errors.fetch_transactions_failed"));
    }
  };

  const handleAdd = async (
    title: string,
    data: { description: string; amount: number; type?: "income" | "expense" }
  ) => {
    console.log(`Adicionando para ${title}:`, data);
    if (!isAuthenticated) {
      logout();
      return;
    }

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        throw new Error("No user ID found in localStorage");
      }
      const parsedUserId = parseInt(storedUserId, 10);

      const newTransaction: FinancialTransaction = {
        id: transactions.length
          ? Math.max(...transactions.map((t) => t.id)) + 1
          : 1,
        date: new Date().toISOString().split("T")[0],
        description: data.description,
        amount: data.amount,
        type: data.type || "expense",
        categoryId: 1, // Default category ID
        userId: parsedUserId,
      };

      setTransactions([...transactions, newTransaction]);

      if (title === t("today_money")) {
        setTodayMoney((prev) =>
          data.type === "income" ? prev + data.amount : prev - data.amount
        );
      } else if (title === t("future_money")) {
        setFutureMoney((prev) => prev + data.amount);
      } else if (title === t("investments_money")) {
        setInvestmentsMoney((prev) => prev + data.amount);
      } else if (title === t("fixed_costs")) {
        setFixedCosts((prev) => prev + data.amount);
      }
      toast.success(t("success.transaction_created"));
    } catch (err) {
      console.error("Failed to add transaction:", err);
      toast.error(t("errors.save_transaction_failed"));
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
      <div className="flex flex-col xl:flex-row gap-2 mb-3 md:gap-3 md:mb-4">
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
