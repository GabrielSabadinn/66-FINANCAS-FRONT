import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { MiniStatisticsCard } from "../components/MiniStatisticsCard";
import { WelcomeCard } from "../components/WelcomeCard";
import { SatisfactionRateCard } from "../components/SatisfactionRateCard";
import { FinancialFreedomCard } from "../components/FinancialFreedomCard";
import { ChartCard } from "../components/ChartCard";
import TransactionTable from "@/components/TransactionTable";
import { Wallet, Globe, FileText, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import {
  fetchBalance,
  fetchTransactions,
  createTransaction,
} from "@/services/apiService";
import { FinancialTransaction } from "@/types";

interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { isAuthenticated, userId, logout } = useAuth();

  const [todayMoney, setTodayMoney] = useState(0);
  const [futureMoney, setFutureMoney] = useState(0);
  const [investmentsMoney, setInvestmentsMoney] = useState(0);
  const [fixedCosts, setFixedCosts] = useState(0);
  const [transactions, setTransactions] = useState<Array<FinancialTransaction>>(
    []
  );

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchData();
    }
  }, [isAuthenticated, userId]);

  const fetchData = async () => {
    try {
      if (!userId) {
        throw new Error("No user ID found");
      }
      const balanceData = await fetchBalance(userId);
      console.log("Fetched balance in Dashboard:", balanceData);

      setTodayMoney(balanceData.balance);

      const validTransactions: FinancialTransaction[] = await fetchTransactions(
        userId
      );

      console.log("Fetched transactions in Dashboard:", validTransactions);
      var totalInvestments = 0;
      var totalFuture = 0;
      var totalFixedCosts = 0;

      for (var i = 0; i < validTransactions.length; i++) {
        if (validTransactions[i].EntryId == 3) {
          totalInvestments += validTransactions[i].Value;
        }
        if (validTransactions[i].EntryId == 4) {
          totalFuture += validTransactions[i].Value;
        }
        if (validTransactions[i].EntryId == 2) {
          totalFixedCosts += validTransactions[i].Value;
        }
      }

      setInvestmentsMoney(totalInvestments);
      setFutureMoney(totalFuture);
      setFixedCosts(totalFixedCosts);
      setTransactions(validTransactions);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error(
        t("errors.fetch_transactions_failed") || "Failed to fetch transactions"
      );
    }
  };

  const handleAdd = async (
    title: string,
    data: {
      description: string;
      amount: number | undefined;
      type: "income" | "expense";
    }
  ) => {
    if (!isAuthenticated || !userId) {
      logout();
      return;
    }
    try {
      const entryIdMap: { [key: string]: number } = {
        [t("today_money")]: 1,
        [t("future_money")]: 4,
        [t("investments_money")]: 3,
        [t("fixed_costs")]: 2,
      };
      const entryId = entryIdMap[title];
      if (!entryId) {
        throw new Error(`Invalid title: ${title}`);
      }
      if (data.amount === undefined || isNaN(data.amount) || data.amount <= 0) {
        throw new Error("Invalid amount");
      }
      const amount = data.amount;
      const newTransaction: Omit<FinancialTransaction, "Id" | "Created_At"> = {
        UserId: parseInt(userId.toString()), // Ensure integer
        EntryType: data.type === "income" ? "C" : "D",
        EntryId: parseInt(entryId.toString()), // Ensure integer
        Value: parseFloat(amount.toFixed(2)), // Ensure decimal
        Description: data.description,
        Date: new Date().toISOString().split(".")[0] + "Z", // Standard ISO format
      };
      console.log("Sending transaction payload:", newTransaction);
      const createdTransaction = await createTransaction(newTransaction);

      setTransactions([...transactions, createdTransaction]);
      if (title === t("today_money")) {
        setTodayMoney((prev) =>
          data.type === "income" ? prev + amount : prev - amount
        );
      } else if (title === t("future_money")) {
        setFutureMoney((prev) => prev + amount);
      } else if (title === t("investments_money")) {
        setInvestmentsMoney((prev) => prev + amount);
      } else if (title === t("fixed_costs")) {
        setFixedCosts((prev) => prev + amount);
      }
      toast.success(
        t("success.transaction_created") || "Transaction created successfully"
      );
    } catch (err) {
      console.error("Failed to add transaction:", err);
      toast.error(
        t("errors.save_transaction_failed") || "Failed to save transaction"
      );
    }
  };

  const getLineChartData = (): LineChartData[] => {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const data: LineChartData[] = months.map((month) => ({
      name: t(`charts.months.${month}`),
      [t("user.entries")]: 0,
      [t("user.expenses")]: 0,
    }));

    transactions.forEach((tx) => {
      const date = new Date(tx.Date);
      if (date.getFullYear() === 2025) {
        const monthIndex = date.getMonth();
        const key =
          tx.EntryType === "C" ? t("user.entries") : t("user.expenses");
        data[monthIndex][key] = (data[monthIndex][key] as number) + tx.Value;
      }
    });

    return data;
  };

  const getBarChartData = (): BarChartData[] => {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const data: BarChartData[] = months.map((month) => ({
      name: t(`charts.months.${month}`),
      [t("charts.sales")]: 0,
    }));

    transactions.forEach((tx) => {
      if (tx.EntryType === "D") {
        const date = new Date(tx.Date);
        if (date.getFullYear() === 2025) {
          const monthIndex = date.getMonth();
          data[monthIndex][t("charts.sales")] =
            (data[monthIndex][t("charts.sales")] as number) + tx.Value;
        }
      }
    });

    return data;
  };

  const getLineChartPercentage = () => {
    const totalExpenses2025 = transactions
      .filter(
        (tx) => tx.EntryType === "D" && new Date(tx.Date).getFullYear() === 2025
      )
      .reduce((sum, tx) => sum + tx.Value, 0);
    const totalExpenses2024 = totalExpenses2025 * 0.95;
    const percentage =
      ((totalExpenses2025 - totalExpenses2024) / totalExpenses2024) * 100;
    return percentage;
  };

  const getBarChartPercentage = () => {
    const mayExpenses = transactions
      .filter(
        (tx) => tx.EntryType === "D" && new Date(tx.Date).getMonth() === 4
      )
      .reduce((sum, tx) => sum + tx.Value, 0);
    const aprilExpenses = transactions
      .filter(
        (tx) => tx.EntryType === "D" && new Date(tx.Date).getMonth() === 3
      )
      .reduce((sum, tx) => sum + tx.Value, 0);
    const percentage = aprilExpenses
      ? ((mayExpenses - aprilExpenses) / aprilExpenses) * 100
      : 23;
    return percentage;
  };

  const lineData = getLineChartData();
  const barData = getBarChartData();
  const linePercentage = getLineChartPercentage();
  const barPercentage = getBarChartPercentage();

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
          // percentage="+55%"
          percentageColor="text-green-400"
          icon={Wallet}
          onAdd={(data) => handleAdd(t("today_money"), data)}
        />
        <MiniStatisticsCard
          title={t("future_money")}
          value={futureMoney}
          //   percentage="-2%"
          percentageColor="text-red-500"
          icon={Globe}
          onAdd={(data) =>
            handleAdd(t("future_money"), { ...data, type: "income" })
          }
        />
        <MiniStatisticsCard
          title={t("investments_money")}
          value={investmentsMoney}
          //  percentage="14%"
          percentageColor="text-green-400"
          icon={FileText}
          onAdd={(data) =>
            handleAdd(t("investments_money"), { ...data, type: "income" })
          }
        />
        <MiniStatisticsCard
          title={t("fixed_costs")}
          value={-Math.abs(fixedCosts)} // Força valor negativo
          percentageColor="text-red-500"
          icon={ShoppingCart}
          onAdd={(data) =>
            handleAdd(t("fixed_costs"), { ...data, type: "expense" })
          }
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
              <span
                className={`font-bold ${
                  linePercentage >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {linePercentage >= 0 ? "+" : ""}
                {linePercentage.toFixed(1)}% {t("more")}
              </span>{" "}
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
              <span
                className={`font-bold ${
                  barPercentage >= 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {barPercentage >= 0 ? "+" : ""}
                {barPercentage.toFixed(1)}%
              </span>{" "}
              {t("more")} {t("in")} {t("charts.months.may")}
            </>
          }
          data={barData}
        />
      </div>
      <TransactionTable
        transactions={transactions}
        title={t("recent_transactions") || "Recent Transactions"}
        register={() => {}}
        hasButton={false}
        type="transaction"
      />
    </div>
  );
}
