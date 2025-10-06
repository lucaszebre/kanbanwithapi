import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverTrigger,
  Popover as UIPopover,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * ReusablePopover
 * Feature highlights:
 * - Controlled or uncontrolled (open / defaultOpen / onOpenChange)
 * - Trigger element via `trigger` prop (optional)
 * - Optional title & description section
 * - Size + align + side variants
 * - Optional action footer (confirm / cancel) with async-safe confirm handler
 * - Form mode (withForm) enabling submit on Enter
 * - Custom renderActions override
 */
export type ReusablePopoverProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  size?: "auto" | "sm" | "md" | "lg" | "xl";
  widthClassName?: string; // manual width override
  withFooter?: boolean; // show confirm/cancel
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
  disableCloseOnConfirm?: boolean;
  variant?: "default" | "destructive";
  loadingText?: string;
  withForm?: boolean;
  formId?: string;
  autoFocusConfirm?: boolean;
  renderActions?: (opts: {
    close: () => void;
    loading: boolean;
    confirm: () => void;
  }) => React.ReactNode;
  // Close when clicking confirm/cancel by default
  closeOnOutsideClick?: boolean; // reserved for future (Radix handles outside click by default)
  /** If provided, adds a subtle divider between header/body/footer */
  showDividers?: boolean;
};

const sizeMap: Record<
  Exclude<ReusablePopoverProps["size"], undefined>,
  string
> = {
  auto: "w-auto",
  sm: "w-48",
  md: "w-64",
  lg: "w-80",
  xl: "w-96",
};

export const ReusablePopover = ({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title,
  description,
  children,
  className,
  contentClassName,
  align = "center",
  side,
  sideOffset = 4,
  size = "md",
  widthClassName,
  withFooter,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  disableCloseOnConfirm,
  variant = "default",
  loadingText = "...",
  withForm,
  formId,
  autoFocusConfirm,
  renderActions,
  showDividers,
}: ReusablePopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState<boolean>(
    defaultOpen ?? false
  );
  const [loading, setLoading] = React.useState(false);
  const isControlled = open !== undefined;
  const popoverOpen = isControlled ? open : internalOpen;

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
      console.error("ReusablePopover onConfirm error", e);
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    onCancel?.();
    close();
  };

  const bodyContent = (
    <div className={cn("flex flex-col gap-3", showDividers && "divide-y")}>
      {
        /* Header */
        (title || description) && (
          <div className={cn("flex flex-col gap-1", showDividers && "pb-2")}>
            {title && (
              <div className="text-sm font-medium leading-none tracking-tight">
                {title}
              </div>
            )}
            {description && (
              <div className="text-xs text-muted-foreground">{description}</div>
            )}
          </div>
        )
      }
      {/* Body */}
      <div
        className={cn("pt-1", showDividers && (title || description) && "pt-2")}
      >
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
      </div>
      {/* Footer */}
      {withFooter && (
        <div
          className={cn("flex justify-end gap-2 pt-2", showDividers && "pt-3")}
        >
          {renderActions ? (
            renderActions({ close, loading, confirm })
          ) : (
            <>
              <Button
                type={withForm ? "submit" : "button"}
                form={withForm ? formId : undefined}
                size="sm"
                variant={variant === "destructive" ? "destructive" : "default"}
                disabled={loading}
                autoFocus={autoFocusConfirm}
                onClick={!withForm ? () => void confirm() : undefined}
              >
                {loading ? loadingText : confirmLabel}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  cancel();
                }}
              >
                {cancelLabel}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <UIPopover open={popoverOpen} onOpenChange={handleOpenChange}>
      {trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          sizeMap[size],
          widthClassName,
          "p-3", // base padding
          className,
          contentClassName
        )}
      >
        {bodyContent}
      </PopoverContent>
    </UIPopover>
  );
};

export default ReusablePopover;
