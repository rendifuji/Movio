import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@/components";

interface DeleteScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  scheduleName: string;
}

const DeleteScheduleModal = ({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  scheduleName,
}: DeleteScheduleModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6" showCloseButton>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Delete Schedule</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete the schedule for{" "}
            <span className="font-semibold text-foreground">
              {scheduleName}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <DialogFooter className="mt-6 flex gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteScheduleModal;
