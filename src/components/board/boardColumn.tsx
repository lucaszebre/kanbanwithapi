import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
// Removed CSS module import
interface BoardColumnProps {
  title: string;
  onChange: (value: string) => void;
  Remove: () => void;
  resetKey?: boolean;
  error: boolean;
}

export const BoardColumn = ({
  title,
  onChange,
  Remove,
  resetKey,
  error,
}: BoardColumnProps) => {
  const [inputValue, setInputValue] = React.useState<string>(title);
  const { theme } = useTheme();
  const { t } = useTranslation("board");

  useEffect(() => {
    // every time the value of resetkey change we reset the value inside the input
    if (resetKey) {
      setInputValue("");
    } else {
      setInputValue(title);
    }
  }, [resetKey, title]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const inputBase =
    "w-[92%] border border-gray-400 rounded-md bg-transparent text-lg font-semibold px-4  cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500";
  const inputColor = theme === "light" ? "text-black" : "text-white";
  const inputError = error ? "border-red-500" : "";

  return (
    <>
      <div className="flex flex-row w-full  items-center justify-between">
        <Input
          placeholder={t("column.placeholder", {
            defaultValue: "eg Column Name",
          })}
          className={`${inputBase} ${inputColor} ${inputError}`}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="flex justify-center items-center h-full ">
          <Icon
            onClick={() => Remove()}
            icon="lucide:x"
            width={16}
            height={16}
            className="text-red-500 cursor-pointer"
          />
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-[12px] mt-1 mb-1">
          {t("column.errorEmpty", { defaultValue: "Can not be empty" })}
        </div>
      )}
    </>
  );
};
