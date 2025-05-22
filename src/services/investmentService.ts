// services/investmentService.ts
import axios from "axios";
import { API_ROUTES } from "@/config/apiRoutes";

const BASE_URL = "http://localhost:3000/api";

interface Investment {
  id: number;
  UserId: number;
  CategoryId: number;
  CategoryName: string;
  Date: string;
  Description: string | null;
  Amount: number;
  ReturnPercentage: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export const investmentService = {
  getAllInvestments: async (accessToken: string): Promise<Investment[]> => {
    try {
      console.log(
        "Calling investments API:",
        `${BASE_URL}/${API_ROUTES.INVESTMENTS.BASE}`
      );
      const response = await axios.get(
        `${BASE_URL}/${API_ROUTES.INVESTMENTS.BASE}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Investments API Response:", response.data);
      return response.data.map((inv: any) => ({
        ...inv,
        id: inv.Id,
      }));
    } catch (error: any) {
      console.error("Investments API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data.message || "Failed to fetch investments"
      );
    }
  },

  createInvestment: async (
    investment: Partial<Investment>,
    accessToken: string
  ): Promise<Investment> => {
    try {
      const payload = { ...investment, Id: investment.id };
      console.log("Creating investment with payload:", payload);
      const response = await axios.post(
        `${BASE_URL}/${API_ROUTES.INVESTMENTS.BASE}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Created investment:", response.data);
      return { ...response.data, id: response.data.Id };
    } catch (error: any) {
      console.error("Create investment error:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Failed to create investment"
      );
    }
  },

  updateInvestment: async (
    id: number,
    investment: Partial<Investment>,
    accessToken: string
  ): Promise<Investment> => {
    try {
      const payload = { ...investment, Id: investment.id };
      console.log("Updating investment with payload:", payload);
      const response = await axios.put(
        `${BASE_URL}/${API_ROUTES.INVESTMENTS.BASE}/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Updated investment:", response.data);
      return { ...response.data, id: response.data.Id };
    } catch (error: any) {
      console.error("Update investment error:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Failed to update investment"
      );
    }
  },

  deleteInvestment: async (id: number, accessToken: string): Promise<void> => {
    try {
      console.log("Deleting investment with id:", id);
      await axios.delete(`${BASE_URL}/${API_ROUTES.INVESTMENTS.BASE}/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Investment deleted successfully");
    } catch (error: any) {
      console.error("Delete investment error:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Failed to delete investment"
      );
    }
  },
};
