import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * ReusableDialog
 * Generic dialog wrapper built on Radix/shadcn primitives.
 * Features:
 * - Optional controlled or uncontrolled open state.
 * - Trigger element (any ReactNode) via `trigger` prop.
 * - Title & description convenience props.
 * - Size variants & custom className.
 * - Action / Cancel buttons with async confirm handling (loading state).
 * - Supports embedding custom children; if `withForm` is true, wraps content in a <form> and calls onConfirm on submit.
 */
export type ReusableDialogProps = {
  trigger?: React.ReactNode; // If omitted, parent can control open manually via open/onOpenChange
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode; // Inner custom content (form fields, etc.)
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  hideActions?: boolean; // If true, footer (actions) not rendered
  onConfirm?: () => Promise<void> | void; // Async safe
  onCancel?: () => void;
  variant?: "default" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string; // Additional classes merged into DialogContent
  footerClassName?: string;
  disableCloseOnConfirm?: boolean; // Keep dialog open after confirm when true
  loadingText?: string;
  withForm?: boolean; // Wrap children in <form> to allow Enter submit
  formId?: string; // optional id for external submit button association
  autoFocusConfirm?: boolean;
  // Provide custom actions completely overriding default buttons
  renderActions?: (opts: {
    close: () => void;
    loading: boolean;
    confirm: () => void;
  }) => React.ReactNode;
  /** Controls visibility of the top-right close (X) button. Defaults to true. */
  showCloseButton?: boolean;
};

const sizeMap: Record<NonNullable<ReusableDialogProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
};

export const ReusableDialog = ({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  hideActions,
  onConfirm,
  onCancel,
  variant = "default",
  size = "lg",
  className,
  footerClassName,
  disableCloseOnConfirm,
  loadingText = "...",
  withForm,
  formId,
  autoFocusConfirm,
  renderActions,
  showCloseButton = false,
}: ReusableDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(
    defaultOpen ?? false
  );
  const [loading, setLoading] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const close = () => handleOpenChange(false);

  const confirm = async () => {
    if (!onConfirm) {
      if (!disableCloseOnConfirm) close();
      return;
    }
    try {
      setLoading(true);
      await onConfirm();
      if (!disableCloseOnConfirm) close();
    } catch (e) {
      // Intentionally swallow to allow UI to handle errors externally
      console.error("ReusableDialog onConfirm error", e);
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    onCancel?.();
    close();
  };

  const content = (
    <DialogContent
      className={cn(sizeMap[size], className)}
      showCloseButton={showCloseButton}
      // allow ESC close unless loading
      onEscapeKeyDown={(e) => {
        if (loading) e.preventDefault();
      }}
    >
      {(title || description) && (
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      )}
      {withForm ? (
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            void confirm();
          }}
          className="contents"
        >
          {children}
        </form>
      ) : (
        children
      )}
      {!hideActions && (
        <DialogFooter className={cn("pt-2", footerClassName)}>
          {renderActions ? (
            renderActions({ close, loading, confirm })
          ) : (
            <>
              <Button
                type={withForm ? "submit" : "button"}
                form={withForm ? formId : undefined}
                variant={variant === "destructive" ? "destructive" : "default"}
                disabled={loading}
                autoFocus={autoFocusConfirm}
                onClick={!withForm ? () => void confirm() : undefined}
              >
                {loading ? loadingText : confirmLabel}
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault();
                    cancel();
                  }}
                >
                  {cancelLabel}
                </Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      )}
    </DialogContent>
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {content}
    </Dialog>
  );
};
