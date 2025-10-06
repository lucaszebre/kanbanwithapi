import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import type { Subtask } from "@/types/Zodtype";
import { RenderSubTask } from "@/utils/renderSubTask";
import { useTheme } from "next-themes";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { useChangeColumnMutation } from "@/api/mutations/useChangeColumnMutation";
import { taskApiServices } from "@/api/task.service";
import { useTaskManagerStore } from "@/state/taskManager";
import type { TaskType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import ReusableSelect from "../reusable/reusable-select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
export const EditTask = ({
  task,
  open,
  setOpen,
}: {
  task: TaskType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { boardIdParms } = useParams();
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const updateTaskLocal = useTaskManagerStore((state) => state.updateTask);

  const { t } = useTranslation("task");
  const [taskName, setTaskName] = useState<string>(task?.title);
  const [taskDescription, setTaskDescription] = useState<string>(
    task?.description
  );
  const [subTask, setSubTask] = useState<Subtask[]>(task?.subtasks);

  const [save, setSave] = useState<boolean>(false);
  const [selectedColumnId, setSelectedColumnId] = useState(task?.columnId);
  const [columnErrors, setColumnErrors] = useState<boolean[]>([]);
  const [inputError, setInputError] = useState<boolean>(false);
  const { theme } = useTheme();
  const boardId = useMemo(
    () => boardIdParms ?? taskManager[0].boards[0].id,
    [boardIdParms, taskManager]
  );
  const currentBoard = useMemo(() => {
    return (
      taskManager[0].boards.find((board) => board.id === boardId) ??
      taskManager[0].boards[0] ??
      null
    );
  }, [boardId, taskManager]);

  // Set the selected column ID whenever the prop changes
  useEffect(() => {
    setSelectedColumnId(task?.columnId);
  }, [task?.columnId]);

  // Set initial column errors based on subtasks

  useEffect(() => {
    const initialColumnErrors = subTask?.map(
      (column) => column.title.trim() === ""
    );
    setColumnErrors(initialColumnErrors);
  }, [subTask]);

  // Update task states when EditTask or openedTask changes

  // Function to add a new subtask
  const handleAddSubtask = () => {
    const id = uuid();
    const newSubtask = {
      id, // empty id marks a new subtask
      title: "",
      isCompleted: false,
    };
    setSubTask([...subTask, newSubtask]);
  };

  // Function to edit/update a subtask
  const handleEditSubtask = (index: number, newTitle: string) => {
    // If 'add' is true, add the subtask to the 'subTasksToAdd' state

    // Update the subtask title
    const updatedSubTasks = [...subTask];
    updatedSubTasks[index].title = newTitle;
    setSubTask(updatedSubTasks);
  };

  // Function to delete a subtask
  const handleDeleteSubtask = (id: string) => {
    setSubTask((prev) => prev.filter((subtask) => subtask.id !== id));
  };

  const queryClient = useQueryClient();
  const updateTask = useMutation({
    mutationFn: (data: {
      id: string;
      title: string;
      description: string;
      columnId: string;
      subtasks: Subtask[];
    }) => taskApiServices.editTask(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards", "Task"] });
      toast.success(t("edit.toast.success"));
    },
    onError: () => {
      toast.error(t("edit.toast.error"));
    },
  });
  const column = useChangeColumnMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskManager && boardId && boardId.length > 0) {
      const updatedTask = {
        id: task.id,
        title: taskName,
        description: taskDescription,
        columnId: task.columnId,
        subtasks: subTask,
      };

      updateTaskLocal({
        boardId,
        ...updatedTask,
      });
      updateTask.mutate(updatedTask);
    }
    if (selectedColumnId && selectedColumnId !== task.columnId) {
      column.mutate({
        newColumnId: selectedColumnId,
        columnId: task.columnId,
        taskId: task.id,
      });
    }
    queryClient.refetchQueries({ queryKey: ["boards"] });
  };

  // Render the EditTask component
  return (
    <ReusableDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) setOpen(open);
      }}
      title={t("edit.modalTitle")}
      hideActions
      size="lg"
      className="w-[480px] max-h-[90%] overflow-y-auto p-8"
    >
      <form
        className="flex flex-col gap-4 w-full h-full items-start justify-between"
        onSubmit={async (e) => {
          e.preventDefault();
          const newColumnErrors = subTask.map((sub) => sub.title.trim() === "");
          setColumnErrors(newColumnErrors);
          if (taskName.trim() === "") {
            console.log("herz 1st");
            setInputError(true);
          } else if (newColumnErrors.some((error) => error)) {
            console.log("herz 2st");

            return;
          } else {
            console.log("3st");
            handleSubmit(e);
            setSave(!save);
            setOpen(false);
          }
        }}
      >
        <Label
          className={`text-xs font-semibold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
          htmlFor="boardName"
        >
          {t("edit.form.titleLabel")}
        </Label>
        <Input
          type="text"
          placeholder={t("edit.form.titlePlaceholder")}
          className={`w-full h-10 border border-gray-400 rounded-md bg-transparent text-lg font-semibold px-4 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${
            theme === "light" ? "text-black" : "text-white"
          } ${inputError ? "border-red-500" : ""}`}
          value={taskName}
          onChange={(e) => {
            setTaskName(e.target.value);
            setInputError(false);
          }}
        />
        {inputError && (
          <div className="text-red-500 text-[12px] mt-1 mb-2">
            {t("edit.validation.titleRequired")}
          </div>
        )}
        {subTask?.length > 0 && (
          <Label
            className={`text-xs font-semibold ${
              theme === "light" ? "text-black" : "text-white"
            }`}
            htmlFor="boardName"
          >
            {t("edit.form.descriptionLabel")}
          </Label>
        )}

        <Textarea
          className={`w-full h-32 border border-gray-400 rounded-md bg-transparent cursor-pointer p-2 resize-none outline-none focus:ring-2 focus:ring-indigo-500 ${
            theme === "light" ? "text-black" : "text-white"
          }`}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></Textarea>

        {subTask?.length > 0 && (
          <Label
            className={`text-xs font-semibold ${
              theme === "light" ? "text-black" : "text-white"
            }`}
            htmlFor="boardName"
          >
            {t("edit.form.subtasksLabel")}
          </Label>
        )}

        <RenderSubTask
          subTasks={subTask}
          handleDeleteSubtask={handleDeleteSubtask}
          handleEditSubTask={handleEditSubtask}
          columnErrors={columnErrors}
        />

        <Button
          className="w-full h-10 rounded-md bg-[rgb(188,211,232)] text-[#635FC7] text-lg font-semibold cursor-pointer"
          type="button"
          onClick={handleAddSubtask}
        >
          {t("edit.form.addSubtaskButton")}
        </Button>
        <Label
          className={`text-xs font-semibold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
          htmlFor=""
        >
          {t("edit.form.statusLabel")}
        </Label>

        <ReusableSelect
          label={null}
          value={selectedColumnId}
          onValueChange={(val) => setSelectedColumnId(val)}
          placeholder={t("view.selectColumnPlaceholder", {
            defaultValue: "Select column",
          })}
          items={(currentBoard?.columns || []).map((col) => ({
            value: col.id,
            label: col.name,
          }))}
          triggerClassName="w-full h-12"
          className="mt-1 w-full"
        />

        <Button
          className="w-full h-10 rounded-md bg-[#635FC7] text-white text-lg font-semibold cursor-pointer"
          type="submit"
        >
          {t("edit.form.saveButton")}
        </Button>
      </form>
    </ReusableDialog>
  );
};
