import axios from "axios";
import { API_ROUTES } from "@/config/apiRoutes";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  categoryId: number;
  userId: number;
}

export const transactionService = {
  async getAllTransactions(): Promise<Transaction[]> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BASE}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.map((transaction: any) => ({
      id: transaction.Id,
      userId: transaction.UserId,
      categoryId: transaction.CategoryId,
      date: new Date(transaction.Date).toISOString().split("T")[0],
      description: transaction.Description || "",
      amount: transaction.Amount ?? 0,
      type: transaction.Type ?? "income",
    }));
  },

  async getTransactionById(id: number): Promise<Transaction> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BY_ID.replace(
        ":id",
        String(id)
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const transaction = response.data;
    return {
      id: transaction.Id,
      userId: transaction.UserId,
      categoryId: transaction.CategoryId,
      date: new Date(transaction.Date).toISOString().split("T")[0],
      description: transaction.Description || "",
      amount: transaction.Amount ?? 0,
      type: transaction.Type ?? "income",
    };
  },

  async createTransaction(data: Omit<Transaction, "id">): Promise<Transaction> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await axios.post(
      `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BASE}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const transaction = response.data;
    return {
      id: transaction.Id,
      userId: transaction.UserId,
      categoryId: transaction.CategoryId,
      date: new Date(transaction.Date).toISOString().split("T")[0],
      description: transaction.Description || "",
      amount: transaction.Amount ?? 0,
      type: transaction.Type ?? "income",
    };
  },

  async updateTransaction(
    id: number,
    data: Partial<Transaction>
  ): Promise<Transaction> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await axios.put(
      `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BY_ID.replace(
        ":id",
        String(id)
      )}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const transaction = response.data;
    return {
      id: transaction.Id,
      userId: transaction.UserId,
      categoryId: transaction.CategoryId,
      date: new Date(transaction.Date).toISOString().split("T")[0],
      description: transaction.Description || "",
      amount: transaction.Amount ?? 0,
      type: transaction.Type ?? "income",
    };
  },

  async deleteTransaction(id: number): Promise<void> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    await axios.delete(
      `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BY_ID.replace(
        ":id",
        String(id)
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
};
