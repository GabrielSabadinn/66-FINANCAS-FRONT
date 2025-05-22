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
  async getAllTransactions(
    accessToken: string,
    userId?: number
  ): Promise<Transaction[]> {
    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const url = userId
        ? `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BASE}?userId=${userId}`
        : `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BASE}`;
      console.log("Calling transactions API:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Transactions API Response:", response.data);

      return response.data.map((transaction: any) => ({
        id: transaction.Id,
        userId: transaction.UserId,
        categoryId: transaction.CategoryId,
        date: new Date(transaction.Date).toISOString().split("T")[0],
        description: transaction.Description || "",
        amount: transaction.Amount ?? 0,
        type: transaction.Type ?? "income",
      }));
    } catch (error: any) {
      console.error("Transactions API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data.message || "Failed to fetch transactions"
      );
    }
  },

  async getTransactionById(
    id: number,
    accessToken: string
  ): Promise<Transaction> {
    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      const url = `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BY_ID.replace(
        ":id",
        String(id)
      )}`;
      console.log("Calling transaction by ID API:", url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Transaction by ID API Response:", response.data);

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
    } catch (error: any) {
      console.error("Transaction by ID API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data.message || "Failed to fetch transaction"
      );
    }
  },

  async createTransaction(
    data: Omit<Transaction, "id">,
    accessToken: string
  ): Promise<Transaction> {
    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      console.log("Creating transaction with payload:", data);
      const response = await axios.post(
        `${API_BASE_URL}/${API_ROUTES.TRANSACTIONS.BASE}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Created transaction:", response.data);

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
    } catch (error: any) {
      console.error("Create transaction error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data.message || "Failed to create transaction"
      );
    }
  },

  async updateTransaction(
    id: number,
    data: Partial<Transaction>,
    accessToken: string
  ): Promise<Transaction> {
    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      console.log("Updating transaction with payload:", data);
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
      console.log("Updated transaction:", response.data);

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
    } catch (error: any) {
      console.error("Update transaction error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data.message || "Failed to update transaction"
      );
    }
  },

  async deleteTransaction(id: number, accessToken: string): Promise<void> {
    if (!accessToken) {
      throw new Error("No access token found");
    }

    try {
      console.log("Deleting transaction with id:", id);
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
      console.log("Transaction deleted successfully");
    } catch (error: any) {
      console.error("Delete transaction error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data.message || "Failed to delete transaction"
      );
    }
  },
};
