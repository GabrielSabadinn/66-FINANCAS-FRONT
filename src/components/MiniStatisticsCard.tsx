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
    category: "C" | "D";
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
    recognition.lang = "pt-BR"; // Fixed to Brazilian Portuguese
  }

  const formatValue = (val: number | string) => {
    if (typeof val === "number") {
      const formatted = val.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      if (val < 0) {
        return <span className="text-red-500">{formatted}</span>;
      } else if (val > 0) {
        return <span className="text-green-400">{formatted}</span>;
      }
      return <span className="text-white">{formatted}</span>;
    }
    return val;
  };

  const formattedValue = formatValue(value);

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
          category: formData.type === "income" ? "C" : "D",
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
          "Reconhecimento de voz não é suportado no seu navegador."
      );
      return;
    }

    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          toast.error(
            t("errors.microphone_permission_denied") ||
              "Acesso ao microfone bloqueado. Permita o acesso nas configurações do navegador."
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

          const words = transcript.split(/\s+/);
          let description = "";
          let amount: number | undefined = undefined;
          let type: "income" | "expense" = "expense";
          let category: "C" | "D" = "D";

          if (words.length >= 3) {
            const typeWord = words[words.length - 1];
            const amountWord = words[words.length - 2];

            // Determine type and category
            if (typeWord === "entrada") {
              type = "income";
              category = "C";
            } else if (typeWord === "despesa") {
              type = "expense";
              category = "D";
            } else {
              toast.error(
                t("errors.invalid_voice_input") ||
                  "Diga: [descrição] [valor] [despesa/entrada]"
              );
              setIsListening(false);
              return;
            }

            // Parse amount
            amount = parseFloat(amountWord) || undefined;

            // Description is all words before the amount
            description = words.slice(0, -2).join(" ").trim();
          }

          if (description && amount !== undefined && amount > 0) {
            onAdd({
              description: description || "Transação por voz",
              amount,
              type: title === t("today_money") ? type : undefined,
              category,
            });
            toast.success(t("success.transaction_created"));
          } else {
            toast.error(
              t("errors.invalid_voice_input") ||
                "Diga: [descrição] [valor] [despesa/entrada]"
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
                "Acesso ao microfone bloqueado. Permita o acesso nas configurações do navegador."
            );
          } else if (event.error === "no-speech") {
            toast.error(
              t("errors.no_speech_detected") ||
                "Nenhuma fala detectada. Tente novamente."
            );
          } else {
            toast.error(
              t("errors.speech_recognition_failed") ||
                "Falha no reconhecimento de voz. Tente novamente."
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
            "Falha ao verificar permissões do microfone."
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
              <p className="text-lg md:text-xl">{formattedValue}</p>
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
                    aria-label={`Adicionar novo ${title}`}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[rgb(30,32,70)] text-white border yılda: none">
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
                      className="bg-[rgb(40,42,80.dark)] border-none text-white px-4 py-2 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                aria-label={`Editar ${title}`}
              >
                {/* <Edit2 className="w-4 h-4 mr-2" /> */}
              </button>
              {title === t("today_money") && (
                <button
                  onClick={handleVoiceInput}
                  className={`text-gray-400 hover:text-white transition-colors ${
                    isListening ? "animate-pulse" : ""
                  }`}
                  aria-label="Entrada por voz"
                  disabled={isListening || !hasSpeechRecognition}
                >
                  <Mic className="w-5 h-5 mr-2" />
                </button>
              )}
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
