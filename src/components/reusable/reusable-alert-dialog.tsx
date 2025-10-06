import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * ReusableAlertDialog
 * A generic confirmation dialog built on top of shadcn/ui AlertDialog primitives.
 *
 * Props:
 * - trigger: ReactNode element that opens the dialog when clicked
 * - title: heading text (red styled if destructive)
 * - description: body text (can contain variable interpolation from parent)
 * - confirmLabel: text for the confirm button (default: Confirm)
 * - cancelLabel: text for cancel button (default: Cancel)
 * - onConfirm: async callback executed when user confirms.
 * - variant: 'destructive' | 'default' (controls styling)
 * - loading: external loading state (optional) if caller manages it
 * - disabled: disables trigger & confirm
 */
export type ReusableAlertDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  variant?: "destructive" | "default";
  loading?: boolean;
  disabled?: boolean;
  /** Optional callback when dialog closes (either action) */
  onOpenChange?: (open: boolean) => void;
  open?: boolean; // optional controlled mode
};

export const ReusableAlertDialog = ({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
  loading: externalLoading,
  disabled,
  onOpenChange,
  open,
}: ReusableAlertDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  function handleOpenChange(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
      handleOpenChange(false);
    }
  }

  const destructive = variant === "destructive";

  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <span className={cn(disabled && "pointer-events-none opacity-50")}>
          {trigger}
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(destructive && "text-red-500")}>
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-left whitespace-pre-wrap">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:gap-2">
          <AlertDialogCancel disabled={loading || externalLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={destructive ? "destructive" : "default"}
              className={cn(
                "min-w-[120px] rounded-2xl",
                destructive && "bg-[#EA5555] hover:bg-[#FF9898]",
                loading || externalLoading ? "opacity-80" : ""
              )}
              disabled={disabled || loading || externalLoading}
              onClick={handleConfirm}
            >
              {loading || externalLoading ? "..." : confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
