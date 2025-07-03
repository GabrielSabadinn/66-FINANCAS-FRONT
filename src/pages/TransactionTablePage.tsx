import React, { useState, useEffect } from "react";
import TransactionTable from "@/components/TransactionTable";
import { useAuth } from "@/context/AuthContext";
import { deleteTransaction, fetchTransactions } from "@/services/apiService";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FinancialTransaction } from "@/types";

// interface FinancialTransaction {
//   id: number;
//   userId: number;
//   entryType: "C" | "D";
//   entryId: number;
//   value: number;
//   description: string;
//   date: string;
//   created_at?: string;
// }

const TransactionTablePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, userId, logout } = useAuth();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
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
      const fetchedTransactions = await fetchTransactions(userId);
      setTransactions(fetchedTransactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      toast.error(
        t("errors.fetch_transactions_failed") || "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: number, date: string) => {
    try {
      await deleteTransaction(id, new Date(date));
      setTransactions(prev => prev.filter(t => t.Id !== id));
      toast.success("Deletado com sucesso");
    } catch {
      toast.error("Erro ao deletar");
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

  return (
    <div
      className="flex flex-col min-h-screen p-4 md:p-6 text-white"
      style={backgroundStyle}
    >
      <div className="max-w-4xl mx-auto w-full pt-14 md:pt-16">
        <TransactionTable transactions={transactions} title={t("recent_transactions") || "Recent Transactions"} register={() => { }} hasButton={false} type="transaction" onDelete={handleDeleteTransaction} />
      </div>
    </div>
  );
};

export default TransactionTablePage;
