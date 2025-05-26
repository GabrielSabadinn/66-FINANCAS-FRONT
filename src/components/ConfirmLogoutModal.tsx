import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  console.log("Modal renderizado, isOpen:", isOpen); // Depuração

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[rgb(30,32,70)] text-white border-none rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-[30px]">
            {t("confirm_logout.title")}
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-[16px]">
            {t("confirm_logout.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-[rgb(40,42,80)] text-white border-none hover:bg-[rgb(50,52,90)] text-[16px]"
          >
            {t("confirm_logout.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-violet-600 hover:bg-violet-700 text-white text-[16px]"
          >
            {t("confirm_logout.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
