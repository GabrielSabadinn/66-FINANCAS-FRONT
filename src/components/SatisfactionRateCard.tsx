import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Notebook, AlertTriangle, Trash2, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { noteService } from "@/services/noteService";

interface NotesDashboardCardProps {
  t: (key: string) => string;
}

export interface Note {
  id?: number;
  text: string;
  dueDate?: string;
}

export const NotesDashboardCard: React.FC<NotesDashboardCardProps> = ({
  t,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const currentDateTime = new Date("2025-06-30T16:00:00-03:00");
  const dueSoonThreshold = new Date(
    currentDateTime.getTime() + 24 * 60 * 60 * 1000
  );

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId") ?? undefined;
        console.log("Fetching notes with userId:", userId);
        if (!accessToken) throw new Error("Token não encontrado");
        const fetchedNotes = await noteService.getNotes(accessToken, userId);
        console.log("Fetched notes:", fetchedNotes);
        setNotes(fetchedNotes);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        alert(t("failed_to_fetch_notes"));
      }
    };
    fetchNotes();
  }, [t]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId") ?? undefined;
      console.log("Creating note with userId:", userId);
      if (!accessToken) throw new Error("Token não encontrado");
      const dateString = dueDate
        ? dueDate
        : new Date().toISOString().split("T")[0];
      const response = await noteService.createNotes(
        newNote.trim(),
        dateString,
        accessToken,
        userId
      );
      console.log("Created note:", response);
      if (!response.id) {
        console.error("Created note has no ID:", response);
        alert(t("failed_to_create_note_no_id"));
        return;
      }
      setNotes([...notes, response]);
      setNewNote("");
      setDueDate("");
    } catch (err) {
      console.error("Failed to create note:", err);
      alert(t("failed_to_create_note"));
    }
  };

  const handleEditNote = (note: Note) => {
    console.log("Edit button clicked for note:", note);
    if (note.id === undefined) {
      console.error("Cannot edit note: ID is undefined");
      alert(t("cannot_edit_note_no_id"));
      return;
    }
    setEditingNoteId(note.id);
    setEditText(note.text);
    setIsModalOpen(true);
    console.log("Opening modal, isModalOpen:", true);
  };

  const handleUpdateNote = async () => {
    if (!editingNoteId || !editText.trim()) {
      console.error("Cannot update note: Invalid ID or empty text");
      alert(t("cannot_update_note_invalid"));
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId") ?? undefined;
      console.log("Updating note with ID:", editingNoteId, "userId:", userId);
      if (!accessToken) throw new Error("Token não encontrado");
      const updatedNote = await noteService.updateNote(
        editingNoteId,
        editText.trim(),
        accessToken,
        userId
      );
      console.log("Updated note:", updatedNote);
      setNotes(
        notes.map((note) => (note.id === editingNoteId ? updatedNote : note))
      );
      setEditingNoteId(null);
      setEditText("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update note:", err);
      alert(t("failed_to_update_note"));
    }
  };

  const handleDeleteNote = async (id?: number) => {
    console.log("Attempting to delete note with id:", id);
    if (!id) {
      console.error("No note ID provided for deletion");
      alert(t("cannot_delete_note_no_id"));
      return;
    }
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) {
      console.error("No note ID for deletion");
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId") ?? undefined;
      console.log("Deleting note with ID:", noteToDelete, "userId:", userId);
      if (!accessToken) throw new Error("Token não encontrado");
      await noteService.deleteNotes(noteToDelete, accessToken, userId);
      setNotes((prevNotes) => {
        const newNotes = prevNotes.filter((note) => note.id !== noteToDelete);
        console.log("Updated notes after deletion:", newNotes);
        return newNotes;
      });
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error("Failed to delete note:", err);
      alert(t("failed_to_delete_note"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdateNote();
    }
  };

  const getNoteStatus = (dueDate?: string) => {
    if (!dueDate) return "normal";
    const noteDueDate = new Date(dueDate + "T23:59:59-03:00");
    if (noteDueDate < currentDateTime) return "overdue";
    if (noteDueDate <= dueSoonThreshold) return "due-soon";
    return "normal";
  };

  console.log("Rendering NotesDashboardCard, notes:", notes);

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardHeader className="mb-6">
        <div className="flex flex-row items-center gap-2">
          <Notebook className="w-6 h-6 text-violet-600" />
          <p className="text-lg text-white font-bold">{t("notes_dashboard")}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Input Section */}
        <div className="flex flex-col gap-2">
          <textarea
            value={newNote}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={t("add_note_placeholder")}
            className="w-full p-3 text-white bg-[#060C29] rounded-lg border border-[#0A0E23] focus:outline-none focus:border-[#582CFF] resize-none h-20"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={handleDateChange}
              className="w-1/2 p-2 text-white bg-[#060C29] rounded-lg border border-[#0A0E23] focus:outline-none focus:border-[#582CFF]"
            />
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="w-1/2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("add_note_button")}
            </button>
          </div>
        </div>
        {/* Notes Display Section */}
        <div className="max-h-48 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">
              {t("no_notes_message")}
            </p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => {
                console.log(
                  "Rendering note with ID:",
                  note.id,
                  "Text:",
                  note.text
                );
                const status = getNoteStatus(note.dueDate);
                return (
                  <li
                    key={note.id || Math.random()}
                    className={`p-3 rounded-lg text-white text-sm flex items-center gap-2 ${
                      status === "overdue"
                        ? "bg-red-900/50 border-l-4 border-red-500"
                        : status === "due-soon"
                        ? "bg-yellow-900/50 border-l-4 border-yellow-500"
                        : "bg-gradient-to-r from-[#060C29] to-[#0A0E23]"
                    }`}
                  >
                    {(status === "overdue" || status === "due-soon") && (
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          status === "overdue"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      />
                    )}
                    <div className="flex-1">
                      <p>{note.text}</p>
                      {note.dueDate && (
                        <p className="text-xs text-gray-400">
                          {t("due_date")}: {note.dueDate}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          console.log(
                            "Edit button clicked for note ID:",
                            note.id
                          );
                          handleEditNote(note);
                        }}
                        className="p-1 text-gray-400 hover:text-violet-600 pointer-events-auto"
                        style={{ zIndex: 10 }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(
                            "Delete button clicked for note ID:",
                            note.id
                          );
                          handleDeleteNote(note.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 pointer-events-auto"
                        style={{ zIndex: 10 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </CardContent>

      {/* Edit Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          console.log("Modal open state changed:", open);
          setIsModalOpen(open);
        }}
      >
        <DialogContent className="bg-[rgb(19,21,54)] text-white border-none">
          <DialogHeader>
            <DialogTitle>{t("edit_note")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={editText}
              onChange={handleEditInputChange}
              onKeyPress={handleEditKeyPress}
              className="w-full p-2 text-white bg-[#060C29] rounded-lg border border-[#0A0E23] focus:outline-none focus:border-[#582CFF]"
              placeholder={t("edit_note_placeholder")}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleUpdateNote}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          console.log("Delete modal open state changed:", open);
          setIsDeleteModalOpen(open);
        }}
      >
        <DialogContent className="bg-[rgb(19,21,54)] text-white border-none">
          <DialogHeader>
            <DialogTitle>{t("confirm_delete")}</DialogTitle>
          </DialogHeader>
          <p>{t("confirm_delete_message")}</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
