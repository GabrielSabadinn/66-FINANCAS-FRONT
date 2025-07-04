import axios from "axios";
import { API_BASE_URL } from "./authService";
import { Note } from "@/components/SatisfactionRateCard";

export const noteService = {
  createNotes: async (
    note: string,
    dueDate: string,
    accessToken: string,
    userId?: string
  ): Promise<Note> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notes`,
        {
          note,
          dueDate: dueDate || null,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Create note response:", response.data);
      return {
        id: response.data.id || response.data._id || response.data.noteId, // Handle different ID field names
        text: response.data.note,
        dueDate: response.data.dueDate,
      };
    } catch (error: any) {
      console.error(
        "Failed to create note:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to create note");
    }
  },

  getNotes: async (accessToken: string, userId?: string): Promise<Note[]> => {
    try {
      console.log("Fetching notes with userId:", userId);
      const response = await axios.get(`${API_BASE_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: { userId },
      });
      console.log("Get notes response:", response.data);
      return response.data.map((item: any) => ({
        id: item.id || item._id || item.noteId, // Handle different ID field names
        text: item.note,
        dueDate: item.dueDate,
      }));
    } catch (error: any) {
      console.error(
        "Failed to fetch notes:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to fetch notes");
    }
  },

  updateNote: async (
    id: number,
    note: string,
    accessToken: string,
    userId?: string
  ): Promise<Note> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/notes/${id}`,
        {
          note,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update note response:", response.data);
      return {
        id: response.data.id || response.data._id || response.data.noteId,
        text: response.data.note,
        dueDate: response.data.dueDate,
      };
    } catch (error: any) {
      console.error(
        "Failed to update note:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to update note");
    }
  },

  deleteNotes: async (
    noteId: number,
    accessToken: string,
    userId?: string
  ): Promise<void> => {
    try {
      console.log("Deleting note with ID:", noteId, "userId:", userId);
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: { userId }, // userId as query param
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
};
