import React, { useEffect, useState } from "react";
import FixedCostTable from "@/components/FixedCostTable";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { createTransaction, fetchTransactions } from "@/services/apiService";
import { toast } from "react-toastify";
import TransactionTable from "@/components/TransactionTable";
import { FinancialTransaction } from "@/types";

const FixedCostTablePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, userId, logout } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchData();
    }
  }, [isAuthenticated, userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!userId) {
        throw new Error("No user ID found");
      }
      const fetchedTransactions = await fetchTransactions(userId, 2);
      setInvestments(fetchedTransactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      toast.error(
        t("errors.fetch_transactions_failed") || "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    background:
      "linear-gradient(90deg, rgba(71,5,138,1) 0%, rgba(22,10,33,1) 50%, rgba(71,5,138,1) 100%)",
  };

  if (loading) {
    return (
      <div
        className="flex flex-col min-h-screen p-4 md:p-6 text-white"
        style={backgroundStyle}
      >
        <div className="max-w-4xl mx-auto w-full pt-14 md:pt-16">
          <p>{t("loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  async function register(
    title: string,
    data: {
      description: string;
      amount: number | string;
      type: "income" | "expense";
    }) {
    if (!isAuthenticated || !userId) {
      logout();
      return;
    }
    try {
      const entryId = 2;
      const amount =
        typeof data.amount === "string" ? parseFloat(data.amount) : data.amount;
      if (isNaN(amount)) {
        throw new Error("Invalid amount");
      }
      const newTransaction: Omit<FinancialTransaction, "Id" | "Created_At"> = {
        UserId: parseInt(userId.toString()), // Ensure integer
        EntryType: "D",
        EntryId: parseInt(entryId.toString()), // Ensure integer
        Value: parseFloat(amount.toFixed(2)), // Ensure decimal
        Description: data.description,
        Date: new Date().toISOString().split(".")[0] + "Z", // Standard ISO format
      };
      console.log("Sending transaction payload:", newTransaction);
      await createTransaction(newTransaction);
      fetchData();
      toast.success(
        t("success.transaction_created") || "Transaction created successfully"
      );
    } catch (err) {
      console.error("Failed to add transaction:", err);
      toast.error(
        t("errors.save_transaction_failed") || "Failed to save transaction"
      );
    }

  }

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-6 text-white"
      style={backgroundStyle}
    >
      <div className="max-w-4xl mx-auto w-full pt-14 md:pt-16">
        {/* <FixedCostTable /> */}
        <TransactionTable transactions={investments} title={t("fixed_costs") || "Fixed Costs"} register={(data) => register(t("fixed_costs"), { ...data, type: "expense" })} hasButton={true} type="fixedCost" />
      </div>
    </div>
  );
};

export default FixedCostTablePage;
