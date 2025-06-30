import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Notebook, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface NotesDashboardCardProps {
  t: (key: string) => string;
}

interface Note {
  text: string;
  dueDate?: string; // Format: YYYY-MM-DD
}

export const NotesDashboardCard: React.FC<NotesDashboardCardProps> = ({
  t,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [dueDate, setDueDate] = useState("");

  const currentDateTime = new Date("2025-06-30T16:00:00-03:00"); // June 30, 2025, 4:00 PM -03
  const dueSoonThreshold = new Date(
    currentDateTime.getTime() + 24 * 60 * 60 * 1000
  ); // 24 hours from now

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newNoteEntry: Note = {
      text: newNote.trim(),
      dueDate: dueDate || undefined,
    };
    setNotes([...notes, newNoteEntry]);
    setNewNote("");
    setDueDate("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewNote(e.target.value);
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

  const getNoteStatus = (dueDate?: string) => {
    if (!dueDate) return "normal";
    const noteDueDate = new Date(dueDate + "T23:59:59-03:00"); // Assume end of day
    if (noteDueDate < currentDateTime) return "overdue";
    if (noteDueDate <= dueSoonThreshold) return "due-soon";
    return "normal";
  };

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
              {notes.map((note, index) => {
                const status = getNoteStatus(note.dueDate);
                return (
                  <li
                    key={index}
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
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
