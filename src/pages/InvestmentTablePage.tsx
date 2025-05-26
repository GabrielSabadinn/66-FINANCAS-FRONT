import TransactionTable from "@/components/TransactionTable";
import { useAuth } from "@/context/AuthContext";
import { createTransaction, fetchTransactions } from "@/services/apiService";
import { FinancialTransaction } from "@/types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const InvestmentTablePage: React.FC = () => {
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
      const fetchedTransactions = await fetchTransactions(userId, 3);
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
      const entryId = 3;
      const amount =
        typeof data.amount === "string" ? parseFloat(data.amount) : data.amount;
      if (isNaN(amount)) {
        throw new Error("Invalid amount");
      }
      const newTransaction: Omit<FinancialTransaction, "Id" | "Created_At"> = {
        UserId: parseInt(userId.toString()), // Ensure integer
        EntryType: "C",
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
        <TransactionTable transactions={investments} title={t("investments_money") || "Investments"} register={(data) => register(t("investments_money"), { ...data, type: "income" })} hasButton={true} type="Investment" />
      </div>
    </div>
  );
};

export default InvestmentTablePage;
