import { useEffect, useState } from "react";

type EditableTextProps = {
  initialValue: string;
  onSave: (newValue: string) => void;
  textClassName?: string;
  inputClassName?: string;
};

export const EditableText = ({
  initialValue,
  onSave,
  textClassName,
  inputClassName,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    if (value.trim() && value !== initialValue) {
      onSave(value);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setIsEditing(false);
        }}
        className={inputClassName}
        autoFocus
      />
    );
  }

  return (
    <h1 onClick={() => setIsEditing(true)} className={textClassName}>
      {value}
    </h1>
  );
};
