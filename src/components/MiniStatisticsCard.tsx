import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Mic, Plus, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface FormData {
  description: string;
  amount: number | undefined;
  type: "income" | "expense";
}

interface MiniStatisticsCardProps {
  title: string;
  value: number | string;
  percentage?: string;
  percentageColor?: string;
  icon: LucideIcon;
  onAdd?: (data: {
    description: string;
    amount: number | undefined;
    type?: "income" | "expense";
  }) => void;
}

export const MiniStatisticsCard: React.FC<MiniStatisticsCardProps> = ({
  title,
  value,
  percentage = "",
  percentageColor = "text-gray-400",
  icon: Icon,
  onAdd,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: "",
    amount: undefined,
    type: "income",
  });
  const [isListening, setIsListening] = useState(false);

  const hasSpeechRecognition =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = t("language_code") || "en-US";
  }

  const formattedValue =
    typeof value === "number" ? value.toLocaleString("en-US") : value;

  const handleEditClick = () => {
    navigate("/tables");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const handleAddSubmit = () => {
    if (
      formData.description &&
      formData.amount !== undefined &&
      formData.amount > 0
    ) {
      if (onAdd) {
        onAdd({
          description: formData.description,
          amount: formData.amount,
          type: title === t("today_money") ? formData.type : undefined,
        });
      }
      setIsOpen(false);
      setFormData({ description: "", amount: undefined, type: "income" });
    } else {
      toast.error(t("errors.invalid_input"));
    }
  };

  const handleVoiceInput = () => {
    if (!recognition || !onAdd) {
      toast.error(
        t("errors.speech_not_supported") ||
          "Speech recognition is not supported in your browser."
      );
      return;
    }

    // Check microphone permission before starting recognition
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          toast.error(
            t("errors.microphone_permission_denied") ||
              "Microphone access is blocked. Please allow microphone permissions in your browser settings."
          );
          return;
        }

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
            .toLowerCase()
            .trim();
          console.log("Voice input:", transcript);

          // Split the transcript into words
          const words = transcript.split(/\s+/);

          // Initialize variables
          let description = "";
          let amount: number | undefined = undefined;
          let type: "income" | "expense" = "expense";

          // Define keywords for income and expense
          const incomeKeywords = [
            "income",
            "salary",
            "earned",
            "receita",
            "salário",
            "ganho",
          ];
          const expenseKeywords = ["expense", "despesa", "gasto", "spent"];

          // Find the amount (first number in the transcript)
          const numberIndex = words.findIndex((word) => /^\d+$/.test(word));
          if (numberIndex !== -1) {
            amount = parseInt(words[numberIndex], 10);
            // Description is everything before the number
            description = words.slice(0, numberIndex).join(" ").trim();
            // Type is the first recognized keyword after the number
            const remainingWords = words.slice(numberIndex + 1);
            const typeWord = remainingWords.find(
              (word) =>
                incomeKeywords.includes(word) || expenseKeywords.includes(word)
            );
            if (typeWord) {
              type = incomeKeywords.includes(typeWord) ? "income" : "expense";
            }
          } else {
            // If no number is found, assume the last word is the type and the rest is description
            const lastWord = words[words.length - 1];
            if (
              incomeKeywords.includes(lastWord) ||
              expenseKeywords.includes(lastWord)
            ) {
              type = incomeKeywords.includes(lastWord) ? "income" : "expense";
              description = words.slice(0, -1).join(" ").trim();
            } else {
              description = transcript;
            }
          }

          // Validate and submit
          if (description && amount !== undefined && amount > 0) {
            onAdd({
              description: description || "Voice transaction",
              amount,
              type: title === t("today_money") ? type : undefined,
            });
            toast.success(t("success.transaction_created"));
          } else {
            toast.error(
              t("errors.invalid_voice_input") ||
                "Please say: [description] [amount] [income/expense]"
            );
          }
          setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "service-not-allowed") {
            toast.error(
              t("errors.microphone_permission_denied") ||
                "Microphone access is blocked. Please allow microphone permissions in your browser settings."
            );
          } else if (event.error === "no-speech") {
            toast.error(
              t("errors.no_speech_detected") ||
                "No speech was detected. Please try again."
            );
          } else {
            toast.error(
              t("errors.speech_recognition_failed") ||
                "Speech recognition failed. Please try again."
            );
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      })
      .catch((err) => {
        console.error("Permission query error:", err);
        toast.error(
          t("errors.speech_recognition_failed") ||
            "Failed to check microphone permissions. Please ensure microphone access is allowed."
        );
      });
  };

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-1">{title}</p>
            <div className="flex items-center gap-1">
              <p className="text-lg text-white md:text-xl">${formattedValue}</p>
              {percentage && (
                <p className={`${percentageColor} font-bold text-xs`}>
                  {percentage}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Add new ${title}`}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[rgb(30,32,70)] text-white border-none">
                  <DialogHeader>
                    <DialogTitle>
                      {t("add")} {title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder={t("description")}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
                    />
                    <Input
                      type="number"
                      placeholder={t("amount")}
                      name="amount"
                      value={formData.amount ?? ""}
                      onChange={handleChange}
                      className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2"
                    />
                    {title === t("today_money") && (
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="bg-[rgb(40,42,80)] border-none text-white px-4 py-2 rounded"
                      >
                        <option value="income">{t("last_incomes")}</option>
                        <option value="expense">{t("last_expenses")}</option>
                      </select>
                    )}
                  </div>
                  <Button
                    onClick={handleAddSubmit}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {t("sign_up_button")}
                  </Button>
                </DialogContent>
              </Dialog>
              <button
                onClick={handleEditClick}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`Edit ${title}`}
              >
                {/* <Edit2 className="w-4 h-4 mr-2" /> */}
              </button>
              <button
                onClick={handleVoiceInput}
                className={`text-gray-400 hover:text-white transition-colors ${
                  isListening ? "animate-pulse" : ""
                }`}
                aria-label="Voice input"
                disabled={isListening || !hasSpeechRecognition}
              >
                <Mic className="w-5 h-5 mr-2" />
              </button>
            </div>
            <div className="flex items-center justify-center w-9 h-9 bg-violet-600 rounded-lg md:w-10 md:h-10">
              <Icon className="w-4 h-4 text-white md:w-5 md:h-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
