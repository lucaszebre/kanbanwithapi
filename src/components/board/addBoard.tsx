import { boardApiServices } from "@/api/board.service";
import { useTaskManagerStore } from "@/state/taskManager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ColumnsRenderer } from "../task/rendercolumn"; // get the render columns
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export const AddBoard = (props: {
  addBoard: boolean;
  setAddBoard: Dispatch<SetStateAction<boolean>>;
}) => {
  const [boardName, setBoardName] = useState<string>(""); // Boardname state
  const [columnNames, setColumnNames] = useState<string[]>(["", ""]); // COlumns Names state
  const [inputError, setInputError] = useState<boolean>(false); // state to manage is the input of board name is empty
  const [columnErrors, setColumnErrors] = useState<boolean[]>([]); // state to manage is one of the column name input is empty
  const { theme } = useTheme();
  const { t } = useTranslation("board");

  const addBoard = useTaskManagerStore((state) => state.addBoard);

  useEffect(() => {
    // when we add a board we use ismoving to update the data and then here we set the current state to the             // the iniatial value
    setBoardName("");
    setColumnNames(["", ""]);
  }, []);

  // ********************************************************************

  const resetForm = () => {
    // function to reset the form
    setBoardName("");
    setColumnNames(["", ""]);
    props.setAddBoard(false);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (formData: { boardName: string; columns: string[] }) =>
      boardApiServices.createBoard(formData.boardName, formData.columns),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success(t("addBoard.successMessage"));
    },
    onError: () => {
      toast.error(t("addBoard.errorMessage"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    // function to handle the final form data
    e.preventDefault();

    const newColumnErrors = columnNames.map(
      (columnName) => columnName.trim() === ""
    );
    setColumnErrors(newColumnErrors);

    if (boardName.trim() === "") {
      setInputError(true);
      return;
    } else if (newColumnErrors.some((error) => error)) {
      return;
    }
    addBoard(boardName, columnNames);
    mutation.mutate({ boardName, columns: columnNames });
    resetForm();
  };

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // handle the change of the board name
    setBoardName(e.target.value);
    setInputError(false);
  };

  const handleColumnTitleChange = (index: number, updatedTitle: string) => {
    // handle the change of column title
    const updatedColumns = [...columnNames];
    updatedColumns[index] = updatedTitle;
    setColumnNames(updatedColumns);
  };

  const addColumn = () => {
    // function to  add a column
    setColumnNames([...columnNames, ""]);
  };

  const removeColumn = (index: number) => {
    // function to remove a column
    const newColumns = [...columnNames];
    newColumns.splice(index, 1);
    setColumnNames(newColumns);
  };

  //*************************************************************** */

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
      style={{ display: props.addBoard ? "flex" : "none" }} // toggle the display of addBoard components
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setAddBoard(false);
        }
      }}
    >
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[90%] max-h-[90%] rounded-2xl p-8 flex flex-col items-start z-15 overflow-auto ${
          theme === "light" ? "bg-white" : "bg-[#2B2C37]"
        }`}
      >
        <h1
          className={`text-2xl font-semibold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          {t("addBoard.title")}
        </h1>
        <form
          className="w-full h-full flex flex-col items-start justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <label
            className={`text-sm font-semibold mb-2 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
            htmlFor="boardName"
          >
            {t("addBoard.boardName")}
          </label>
          <input
            className={`w-full border rounded-lg bg-transparent text-xl font-semibold px-4 mb-4 cursor-pointer h-10 placeholder:text-gray-400 placeholder:text-base focus:outline-none ${
              theme === "light"
                ? "text-black border-gray-400"
                : "text-white border-gray-400"
            } ${inputError ? "border-red-500" : ""}`}
            type="text"
            id="boardName"
            placeholder={t("addBoard.boardNamePlaceholder")}
            onChange={(e) => {
              handleBoardNameChange(e);
            }}
            value={boardName}
          />
          {inputError && (
            <div className="text-red-500 text-xs mt-1">
              {t("addBoard.boardNameError")}
            </div>
          )}
          {columnNames.length > 0 && (
            <Label
              className={`text-sm font-semibold mb-2 ${
                theme === "light" ? "text-black" : "text-white"
              }`}
              htmlFor="boardColumns"
            >
              {t("addBoard.boardColumns")}
            </Label>
          )}
          <ColumnsRenderer
            columnNames={columnNames}
            handleColumnTitleChange={handleColumnTitleChange}
            removeColumn={removeColumn}
            columnErrors={columnErrors}
          />
          <Button
            disabled={inputError}
            type="button"
            className={`w-full h-10 border-none rounded-lg text-xl font-semibold cursor-pointer mb-2 ${
              theme === "light"
                ? "bg-blue-50 text-[#635FC7]"
                : "bg-white text-[#635FC7]"
            }`}
            onClick={addColumn}
          >
            {t("addBoard.addColumn")}
          </Button>
          <Button
            className="w-full h-10 border-none rounded-lg bg-[#635FC7] text-white text-xl font-semibold cursor-pointer mb-2"
            type="submit"
          >
            {t("addBoard.createBoard")}
          </Button>
        </form>
      </div>
    </div>
  );
};
