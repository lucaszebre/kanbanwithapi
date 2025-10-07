import { taskApiServices } from "@/api/task.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Subtask } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import ReusableSelect from "../reusable/reusable-select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { SubTasks } from "./subTasks";
export const AddTask = (props: {
  addTask: boolean;
  setAddTask: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const addTask = useTaskManagerStore((state) => state.addTask);
  const { t } = useTranslation("task");
  const { boardId: boardIdParams } = useParams();
  const [title, setTitle] = useState(""); // state for the task title
  const [description, setDescription] = useState(""); // state for task description
  const [subtasks, setSubTasks] = useState<Subtask[]>([]); // states to save up the name of all the subtasks I add
  const [subTasksError, setSubTasksError] = useState<boolean[]>([]); // state to handle if one of the subtasks is empty
  const [taskTitleError, setTaskTitleError] = useState(false); // state to handle if the task title is empty
  const [columnId, setColumnId] = useState(""); // state to know which column is selected
  const boardId = useMemo(
    () => (boardIdParams ? boardIdParams : taskManager?.boards?.[0]?.id),
    [boardIdParams, taskManager]
  );
  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);
  useEffect(() => {
    if (taskManager && currentBoard && currentBoard?.columns) {
      setColumnId(currentBoard.columns[0]?.id);
    }
  }, [currentBoard, taskManager]);

  const queryClient = useQueryClient();
  const addTaskMutation = useMutation({
    mutationFn: (formData: {
      title: string;
      description: string;
      columnId: string;
      subtasks: Subtask[];
    }) => taskApiServices.createTask(formData),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success(t("add.toast.success"));
    },
    onError: () => {
      toast.error(t("add.toast.error"));
    },
  });
  function addSubTask() {
    setSubTasks([
      ...subtasks,
      { id: uuidv4(), title: "", isCompleted: false, index: subtasks.length },
    ]);
  }
  const handleColumnTitleChange = (index: number, updatedTitle: string) => {
    const updatedColumns = [...subtasks];
    updatedColumns[index] = { ...updatedColumns[index], title: updatedTitle };
    setSubTasks(updatedColumns);
    setTaskTitleError(false);
  };
  function handleSubTaskDelete(index: number) {
    const newSubTask = [...subtasks];
    newSubTask.splice(index, 1);
    setSubTasks(newSubTask);
  }
  const HandleSubmit = async () => {
    if (title && description && columnId && boardId) {
      addTask({
        id: uuidv4(),
        boardId,
        title,
        description,
        columnId,
        subtasks,
        index:
          currentBoard.columns.find((c) => c.id === columnId)?.tasks.length ||
          1,
      });
      addTaskMutation.mutate({
        title: title,
        description: description,
        columnId: columnId,
        subtasks,
      });
      setTitle("");
      setDescription("");
      setSubTasks([]);
    } else {
      console.error(t("add.console.submitError"));
    }
  };

  return (
    <Dialog open={props.addTask} onOpenChange={props.setAddTask}>
      <DialogContent
        className="max-h-[90%] w-[480px] overflow-y-auto"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>{t("add.modalTitle")}</DialogTitle>
        </DialogHeader>
        <form
          className="flex h-full w-full flex-col items-start justify-between"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!subtasks || !title) {
              const newSubTaskErrors = subtasks.map(
                (subTask) => subTask.title.trim() === ""
              );
              setSubTasksError(newSubTaskErrors);
              if (title.trim() === "") {
                setTaskTitleError(true);
              } else if (newSubTaskErrors.some((error) => error)) {
                console.error("error in subtask ");
                return;
              }
            } else {
              await HandleSubmit();
              props.setAddTask(false);
            }
          }}
        >
          <Label className="mb-2 text-xs font-semibold" htmlFor="taskTitle">
            {t("add.form.titleLabel")}
          </Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTaskTitleError(false);
            }}
            className={`mb-4 h-10 w-full cursor-pointer rounded-md border border-gray-400 bg-transparent px-4 text-lg font-semibold outline-none focus:ring-2 focus:ring-indigo-500 ${
              taskTitleError ? "border-red-500" : ""
            }`}
          />
          {taskTitleError && (
            <div className="mb-2 text-sm text-red-500">
              {t("add.validation.titleRequired")}
            </div>
          )}
          <Label
            className="mb-2 text-xs font-semibold"
            htmlFor="taskDescription"
          >
            {t("add.form.descriptionLabel")}
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            cols={30}
            rows={10}
            className="mb-4 w-full cursor-pointer rounded-md border border-gray-400 bg-transparent px-4 py-2 text-lg font-semibold"
          ></Textarea>
          {subtasks.length > 0 && (
            <Label
              className="mb-2 text-xs font-semibold"
              htmlFor="taskColumnSelect"
            >
              {t("add.form.subtasksLabel")}
            </Label>
          )}
          <SubTasks
            subTasks={subtasks}
            handleSubTaskDelete={handleSubTaskDelete}
            handleColumnTitleChange={handleColumnTitleChange}
            columnErrors={subTasksError}
          />
          <Button
            className="mb-6 w-full  rounded-md bg-indigo-600 px-4 font-semibold text-white transition-colors hover:bg-indigo-700"
            style={{ marginBottom: "25px" }}
            onClick={(e) => {
              e.preventDefault();
              addSubTask();
            }}
          >
            {t("add.form.addSubtaskButton")}
          </Button>

          <ReusableSelect
            label={null}
            value={columnId}
            onValueChange={(val) => setColumnId(val)}
            placeholder={t("view.selectColumnPlaceholder", {
              defaultValue: "Select column",
            })}
            items={(currentBoard?.columns || []).map((col) => ({
              value: col.id,
              label: col.name,
            }))}
            triggerClassName="w-full h-12"
            className="mt-1 w-full pb-4"
          />
          <Button className=" w-full rounded-md  font-semibold " type="submit">
            {t("add.form.createButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
