import { boardApiServices } from "@/api/board.service";
import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import { Button } from "@/components/ui/button";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Board, Column } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidV4 } from "uuid";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { BoardColumn } from "./boardColumn";
export const EditBoard = ({
  board,
  editBoard,
  setEditBoard,
}: {
  board: Board;
  editBoard: boolean;
  setEditBoard: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation("board");
  const [name, setName] = useState(board?.name);
  const [columns, setColumns] = useState(board?.columns);
  const [columnErrors, setColumnErrors] = useState<boolean[]>([]); // state to handle if one input is empty
  const [inputError, setInputError] = useState<boolean>(false);
  const { theme } = useTheme();

  const updateBoardLocal = useTaskManagerStore((state) => state.updateBoard);

  const addColumn = () => {
    const newColumn: Column = {
      id: uuidV4(),
      name: "",
      tasks: [],
      index: columns?.length,
    };
    setColumns([...columns, newColumn]);
  };

  useEffect(() => {
    setName(board?.name);
    setColumns(board?.columns);
  }, [board]);

  function deleteColumn(columnId: string) {
    const updatedColumns = columns.filter((c) => c.id !== columnId);

    setColumns([...updatedColumns]);
  }

  const handleEditColumn = (index: number, columnName: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      name: columnName,
      index,
    };
    setColumns(updatedColumns);
  };

  function renderColumns() {
    return (
      <div className="flex flex-col gap-4 w-full ">
        {columns?.map((column, index) => (
          <BoardColumn
            key={index}
            title={column.name}
            onChange={(updatedTitle: string) =>
              handleEditColumn(index, updatedTitle)
            }
            Remove={() => deleteColumn(column.id)}
            error={columnErrors[index] || false}
          />
        ))}
      </div>
    );
  }

  const queryClient = useQueryClient();
  const updateBoard = useMutation({
    mutationFn: (formData: { id: string; name: string; columns: Column[] }) => {
      console.log(formData, "formData");
      return boardApiServices.updateBoard(formData);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success(t("editBoard.successMessage"));
    },
    onError: () => {
      toast.error(t("editBoard.errorMessage"));
    },
  });

  return (
    <ReusableDialog
      open={editBoard}
      onOpenChange={(o) => {
        if (!o) {
          queryClient.refetchQueries({ queryKey: ["boards"] });
          setEditBoard(false);
        } else {
          setEditBoard(true);
        }
      }}
      title={
        <span className="text-black dark:text-white">
          {t("editBoard.title")}
        </span>
      }
      description={null}
      confirmLabel={t("editBoard.saveChanges")}
      cancelLabel={t("editBoard.cancel")}
      withForm
      formId="edit-board-form"
      onConfirm={async () => {
        const newColumnErrors = columns.map(
          (column) => column.name.trim() === ""
        );
        setColumnErrors(newColumnErrors);
        if (board?.name.trim() === "") {
          setInputError(true);
        }
        if (newColumnErrors.some((error) => error)) {
          toast.error(t("editBoard.emptyInput"));
          return;
        }

        updateBoardLocal({ columns, id: board.id, name });
        updateBoard.mutate({
          id: board.id,
          columns,
          name,
        });

        queryClient.refetchQueries({ queryKey: ["boards"] });
      }}
      renderActions={({ loading, confirm, close }) => (
        <>
          <Button
            type="submit"
            form="edit-board-form"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              void confirm();
            }}
          >
            {loading ? t("editBoard.saving") : t("editBoard.saveChanges")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => close()}
          >
            {t("editBoard.cancel")}
          </Button>
        </>
      )}
    >
      <form
        id="edit-board-form"
        className="w-full max-h-[70vh] overflow-auto gap-2 flex flex-col items-start"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Label className={`mb-2 text-xs font-semibold `} htmlFor="boardName">
          {t("editBoard.boardName")}
        </Label>
        <Input
          type="text"
          name="boardName"
          placeholder={t("editBoard.boardName")}
          className={`w-[93%] h-10 border border-gray-400 rounded-md bg-transparent text-lg font-semibold px-4 mb-4 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${
            theme === "light" ? "text-black" : "text-white"
          } 
          
          
          `}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        {inputError && (
          <div className="text-red-500 text-[12px] mt-1 mb-2">
            {t("editBoard.boardNameError")}
          </div>
        )}

        {columns?.length > 0 && (
          <Label
            className={`mb-2 text-xs font-semibold ${
              theme === "light" ? "text-black" : "text-white"
            }`}
            htmlFor="boardDescription"
          >
            {t("editBoard.boardColumns")}
          </Label>
        )}
        {renderColumns()}
        <Button
          variant="outline"
          className="w-full h-10 mb-2"
          onClick={(e) => {
            e.preventDefault();
            addColumn();
          }}
          type="button"
        >
          {t("editBoard.addColumn")}
        </Button>
      </form>
    </ReusableDialog>
  );
};
