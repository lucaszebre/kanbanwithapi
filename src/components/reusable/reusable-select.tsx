import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React, { useId } from "react";

/**
 * Shape of each option item accepted by ReusableSelect.
 */
export interface ReusableSelectItem {
  /** Value submitted in forms. Must be unique within the select. */
  value: string;
  /** Visual label (defaults to value if omitted). */
  label?: React.ReactNode;
  /** Optional grouping key. Items sharing the same group are rendered together. */
  group?: string;
  /** Disable selection of this item. */
  disabled?: boolean;
  /** Optional leading icon / element. */
  icon?: React.ReactNode;
  /** Arbitrary metadata the caller may need later. */
  meta?: unknown;
}

export interface ReusableSelectProps {
  /** Flat list of items. You can also pass `groups` instead. */
  items?: ReusableSelectItem[];
  /** Pre-grouped items keyed by group label. Overrides `items` when provided. */
  groups?: Record<string, ReusableSelectItem[]>;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Callback when value changes. Provides the raw value and the resolved item (if any). */
  onValueChange?: (value: string, item: ReusableSelectItem | undefined) => void;
  /** Visual label displayed above the trigger. */
  label?: React.ReactNode;
  /** Extra description / helper text below the trigger. */
  description?: React.ReactNode;
  /** Error message text (sets aria-invalid when present). */
  error?: React.ReactNode;
  /** Placeholder shown when no value selected. */
  placeholder?: React.ReactNode;
  /** Whether the field is required in a form context. */
  required?: boolean;
  /** Disable the select entirely. */
  disabled?: boolean;
  /** Message to display when no items exist. */
  emptyMessage?: React.ReactNode;
  /** Whether data is currently loading. Disables trigger & shows spinner icon. */
  loading?: boolean;
  /** Message to display while loading inside the dropdown list. */
  loadingMessage?: React.ReactNode;
  /** Custom class for outer wrapper. */
  className?: string;
  /** Custom class for the SelectTrigger. */
  triggerClassName?: string;
  /** Custom class for the SelectContent. */
  contentClassName?: string;
  /** Custom class for each SelectItem. */
  itemClassName?: string;
  /** Optional id (used for label htmlFor association). */
  id?: string;
  /** Name for form submission */
  name?: string;
  /** Custom renderer for an item. Receives the item and whether it is selected. */
  renderItem?: (item: ReusableSelectItem, selected: boolean) => React.ReactNode;
  /** Insert a separator between groups (default true). */
  showGroupSeparators?: boolean;
}

/**
 * A high-level, ergonomic wrapper around the shadcn/Radix Select primitive.
 * Provides: grouping, loading states, empty state, label/description/error slots.
 */
export const ReusableSelect = React.forwardRef<
  HTMLButtonElement,
  ReusableSelectProps
>(
  (
    {
      items,
      groups,
      value,
      defaultValue,
      onValueChange,
      label,
      description,
      error,
      placeholder = "Select...",
      required,
      disabled,
      emptyMessage = "No options",
      loading,
      loadingMessage = "Loading...",
      className,
      triggerClassName,
      contentClassName,
      itemClassName,
      id,
      name,
      renderItem,
      showGroupSeparators = true,
    },
    ref
  ) => {
    // Normalize items if groups passed.
    const computedGroups: Record<string, ReusableSelectItem[]> =
      React.useMemo(() => {
        if (groups) return groups;
        if (!items) return {};
        // Derive grouping (items without group go into a single implicit group).
        const result: Record<string, ReusableSelectItem[]> = {};
        items.forEach((it) => {
          const g = it.group || "__ungrouped__";
          if (!result[g]) result[g] = [];
          result[g].push(it);
        });
        return result;
      }, [groups, items]);

    const flatItems: ReusableSelectItem[] = React.useMemo(() => {
      if (items) return items;
      if (groups) return Object.values(groups).flat();
      return [];
    }, [items, groups]);

    const selectedItem = React.useMemo(
      () => flatItems.find((i) => i.value === value),
      [flatItems, value]
    );

    const handleChange = (val: string) => {
      onValueChange?.(
        val,
        flatItems.find((i) => i.value === val)
      );
    };
    const optionalId = useId();

    const fieldId = id || optionalId;
    const descriptionId = description ? `${fieldId}-desc` : undefined;
    const errorId = error ? `${fieldId}-err` : undefined;
    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    const groupKeys = Object.keys(computedGroups);
    const hasRealGroups = groupKeys.some((k) => k !== "__ungrouped__");

    const renderSelectItem = (item: ReusableSelectItem) => (
      <SelectItem
        key={item.value}
        value={item.value}
        disabled={item.disabled || loading}
        className={itemClassName}
      >
        {renderItem ? (
          renderItem(item, item.value === value)
        ) : (
          <>
            {item.icon}
            <span className="truncate">{item.label ?? item.value}</span>
          </>
        )}
      </SelectItem>
    );

    return (
      <div
        className={cn("flex flex-col gap-1", className)}
        data-select-wrapper
        aria-invalid={!!error || undefined}
      >
        {label && (
          <label
            htmlFor={fieldId}
            className={cn("text-sm font-medium", error && "text-destructive")}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={handleChange}
          disabled={disabled || loading}
          name={name}
        >
          <SelectTrigger
            ref={ref}
            id={fieldId}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            aria-invalid={!!error || undefined}
            className={cn(
              "w-full justify-between",
              error && "border-destructive focus-visible:ring-destructive/40",
              triggerClassName
            )}
          >
            <SelectValue
              placeholder={
                loading ? (
                  <span className="flex items-center gap-2 opacity-70">
                    <Spinner className="size-3" /> {loadingMessage}
                  </span>
                ) : (
                  placeholder
                )
              }
            >
              {selectedItem?.icon}
              {selectedItem?.label ?? selectedItem?.value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className={contentClassName}>
            {loading && (
              <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground">
                <Spinner className="size-3" /> {loadingMessage}
              </div>
            )}
            {!loading && flatItems.length === 0 && (
              <div className="p-2 text-xs text-muted-foreground">
                {emptyMessage}
              </div>
            )}
            {!loading && flatItems.length > 0 && (
              <>
                {groupKeys.map((groupKey, idx) => {
                  const groupItems = computedGroups[groupKey];
                  if (!groupItems || groupItems.length === 0) return null;
                  const isUngrouped = groupKey === "__ungrouped__";
                  return (
                    <React.Fragment key={groupKey}>
                      {hasRealGroups && !isUngrouped && (
                        <SelectGroup>
                          <SelectLabel>{groupKey}</SelectLabel>
                          {groupItems.map(renderSelectItem)}
                        </SelectGroup>
                      )}
                      {(!hasRealGroups || isUngrouped) &&
                        groupItems.map(renderSelectItem)}
                      {showGroupSeparators && idx < groupKeys.length - 1 && (
                        <SelectSeparator />
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </SelectContent>
        </Select>
        {(description || error) && (
          <div
            className="min-h-[1.25rem] text-xs leading-snug"
            id={describedBy}
          >
            {error ? (
              <p id={errorId} className="text-destructive">
                {error}
              </p>
            ) : (
              description && (
                <p id={descriptionId} className="text-muted-foreground">
                  {description}
                </p>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);
ReusableSelect.displayName = "ReusableSelect";

const Spinner: React.FC<React.HTMLAttributes<SVGSVGElement>> = ({
  className,
  ...rest
}) => (
  <svg
    className={cn("animate-spin text-current", className)}
    viewBox="0 0 24 24"
    fill="none"
    {...rest}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export default ReusableSelect;
