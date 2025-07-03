import axios from "axios";
import { API_BASE_URL } from "./authService";
import { Note } from "@/components/SatisfactionRateCard";

export const noteService = {
  createNotes: async (
    note: string,
    date: string,
    accessToken: string
  ): Promise<Note> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notes/create`,
        {
          note,
          dueDate: date || null,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Create note response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to create note:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to create note");
    }
  },

  deleteNotes: async (noteId: number, accessToken: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/notes/delete`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {
          noteId,
        },
      });
      console.log("Note deleted:", { noteId });
    } catch (error: any) {
      console.error(
        "Failed to delete note:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to delete note");
    }
  },

  getNotes: async (accessToken: string): Promise<Note[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Get notes response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Failed to fetch notes:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to fetch notes");
    }
  },
};
