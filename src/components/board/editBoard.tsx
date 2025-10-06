import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import { Button } from "@/components/ui/button";
import { useTaskManagerStore } from "@/state/taskManager";
import type { ColumnData, ColumnType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { BoardColumn } from "./boardColumn";
import { handleSaveChanges } from "./handleSave";

export const EditBoard = (props: {
  editBoard: boolean;
  setEditBoard: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { boardId } = useParams();
  const [copyBoardColumns, setCopyBoardColumns] = useState<ColumnType[]>([]); // state to know the current present in the database
  const [Save, SetSave] = useState<boolean>(false); // state to toggle the disabled thhe button save
  const [header, setHeader] = useState("");
  const [columnErrors, setColumnErrors] = useState<boolean[]>([]); // state to handle if one input is empty
  const [inputError, setInputError] = useState<boolean>(false); // state to handle if the boardname is empty
  const [columnstoAdd, setColumnstoAdd] = useState<ColumnType[]>([]); // state to know the column to add in the database
  const [columnsToDelete, setColumnsToDelete] = useState<string[]>([]); // state to know the column to delete in the database
  const [columnsToRename, setColumnsToRename] = useState<ColumnData[]>([]); // state to know the column to rename in the database
  const { theme } = useTheme();

  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const updateBoard = useTaskManagerStore((state) => state.updateBoard);
  const currentBoard = useMemo(() => {
    return (
      taskManager[0].boards.find((board) => board.id === boardId) ??
      taskManager[0].boards[0] ??
      null
    );
  }, [boardId, taskManager]);
  useEffect(() => {
    setColumnstoAdd([]);
    setColumnsToRename([]);
    setColumnsToDelete([]);
  }, [Save]);

  useEffect(() => {
    if (taskManager && currentBoard && currentBoard?.columns) {
      setCopyBoardColumns(currentBoard?.columns);
      const initialColumnErrors = currentBoard?.columns.map(
        (column: { name: string }) => column.name.trim() === ""
      );
      setColumnErrors(initialColumnErrors);

      setHeader(currentBoard.name);
    }
  }, [currentBoard, taskManager]); // every some thing is moving in the data we get the new headertiltle and columns of the currentboard

  const handleAddColumn = () => {
    // function to add column
    const newColumn = {
      id: "",
      name: "",
      tasks: [],
      add: true,
    };
    setCopyBoardColumns([...copyBoardColumns, newColumn]);
    setColumnstoAdd([...columnstoAdd, newColumn]);
  };

  function handleDeleteColumn(index: number, columnId: string) {
    // function to delete column
    const updatedColumns = [...copyBoardColumns];
    updatedColumns.splice(index, 1);
    setCopyBoardColumns(updatedColumns);
    setColumnsToDelete([...columnsToDelete, columnId]);

    // Filter out the deleted column from columnsToRename
    const updatedColumnsToRename = columnsToRename.filter(
      (column) => column.id !== columnId
    );
    setColumnsToRename(updatedColumnsToRename);

    // Update columnErrors state by removing the corresponding error
    const updatedColumnErrors = [...columnErrors];
    updatedColumnErrors.splice(index, 1);
    setColumnErrors(updatedColumnErrors);
  }

  const handleEditColumn = (
    index: number,
    columnName: string,
    add?: boolean
  ) => {
    const updatedColumns = [...copyBoardColumns];
    updatedColumns[index] = { ...updatedColumns[index], name: columnName };
    setCopyBoardColumns(updatedColumns);

    const updatedColumnErrors = [...columnErrors];
    updatedColumnErrors[index] = columnName.trim() === "";
    setColumnErrors(updatedColumnErrors);

    if (add) {
      const existingColumnIndex = columnstoAdd.findIndex(
        (c) => c.id === updatedColumns[index].id
      );
      if (existingColumnIndex !== -1) {
        const updatedColumnsToAdd = [...columnstoAdd];
        updatedColumnsToAdd[existingColumnIndex] = updatedColumns[index];
        setColumnstoAdd(updatedColumnsToAdd);
      }
    } else {
      const existingColumnIndex = columnsToRename.findIndex(
        (c) => c.id === updatedColumns[index].id
      );
      if (existingColumnIndex === -1) {
        setColumnsToRename([...columnsToRename, updatedColumns[index]]);
      } else {
        const updatedColumnsToRename = [...columnsToRename];
        updatedColumnsToRename[existingColumnIndex] = updatedColumns[index];
        setColumnsToRename(updatedColumnsToRename);
      }
    }
  };

  function renderColumns() {
    return copyBoardColumns.map((column, index) => (
      <BoardColumn
        key={index}
        title={column.name}
        onChange={(updatedTitle: string) =>
          handleEditColumn(index, updatedTitle, column.add)
        }
        Remove={() => handleDeleteColumn(index, column.id)}
        error={columnErrors[index] || false}
      />
    ));
  }

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (formData: {
      columnsToDelete: string[];
      columnsToRename: ColumnData[];
      columnstoAdd: ColumnType[];
      currentBoardId: string;
      Header: string;
      headerTitle: string;
    }) =>
      handleSaveChanges(
        formData.columnsToDelete,
        formData.columnsToRename,
        formData.columnstoAdd,
        formData.currentBoardId,
        formData.Header,
        formData.headerTitle
      ),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success("Edit board  sucessfully");
    },
    onError: () => {
      toast.error("Error to edit the board");
    },
  });

  return (
    <ReusableDialog
      open={props.editBoard}
      onOpenChange={(o) => {
        if (!o) {
          queryClient.refetchQueries({ queryKey: ["boards"] });
          props.setEditBoard(false);
        } else {
          props.setEditBoard(true);
        }
      }}
      title={<span className="text-black dark:text-white">Edit Board</span>}
      description={null}
      confirmLabel="Save Changes"
      cancelLabel="Cancel"
      withForm
      formId="edit-board-form"
      onConfirm={async () => {
        const newColumnErrors = copyBoardColumns.map(
          (column) => column.name.trim() === ""
        );
        setColumnErrors(newColumnErrors);
        if (currentBoard?.name.trim() === "") {
          setInputError(true);
          throw new Error("Header missing");
        }
        if (newColumnErrors.some((error) => error)) {
          throw new Error("Column errors");
        }
        updateBoard({});
        await mutation.mutateAsync({
          columnsToDelete,
          columnsToRename,
          columnstoAdd: columnstoAdd,
          currentBoardId: currentBoard?.id,
          Header: header,
          headerTitle: currentBoard?.name,
        });
        SetSave(!Save);
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => close()}
          >
            Cancel
          </Button>
        </>
      )}
    >
      <form
        id="edit-board-form"
        className="w-full max-h-[70vh] overflow-auto flex flex-col items-start"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label
          className={`mb-2 text-xs font-semibold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
          htmlFor="boardName"
        >
          Board Name
        </label>
        <input
          type="text"
          name="boardName"
          placeholder="Board Name"
          className={`w-[93%] h-10 border border-gray-400 rounded-md bg-transparent text-lg font-semibold px-4 mb-4 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${
            theme === "light" ? "text-black" : "text-white"
          } ${inputError ? "border-red-500" : ""}`}
          value={header}
          onChange={(e) => {
            setInputError(false);
            setHeader(e.target.value);
          }}
        />
        {inputError && (
          <div className="text-red-500 text-[12px] mt-1 mb-2">
            Please enter a board name.
          </div>
        )}
        <label
          className={`mb-2 text-xs font-semibold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
          htmlFor="boardDescription"
        >
          Board Columns
        </label>
        {renderColumns()}
        <Button
          variant="outline"
          className="w-full h-10 mb-2"
          onClick={(e) => {
            e.preventDefault();
            handleAddColumn();
          }}
          type="button"
        >
          + Add Column
        </Button>
      </form>
    </ReusableDialog>
  );
};
