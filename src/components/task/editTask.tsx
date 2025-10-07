import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import { useTheme } from "next-themes";
import { useEffect, useMemo, type Dispatch, type SetStateAction } from "react";

import { taskApiServices } from "@/api/task.service";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Subtask, Task } from "@/types/global";
import { EditTaskSchema } from "@/types/TaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import type { z } from "zod";
import { Icons } from "../common/icons";
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
  task: Task;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { boardIdParms } = useParams();
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const updateTaskLocal = useTaskManagerStore((state) => state.updateTask);
  const changeCol = useTaskManagerStore((state) => state.changeCol);

  const { t } = useTranslation("task");

  const { theme } = useTheme();
  const boardId = useMemo(
    () => boardIdParms ?? taskManager?.boards?.[0]?.id,
    [boardIdParms, taskManager]
  );
  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);

  const form = useForm<z.infer<typeof EditTaskSchema>>({
    resolver: zodResolver(EditTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      subtasks: task.subtasks,
      columnId: task.columnId,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description,
      subtasks: task.subtasks,
      columnId: task.columnId,
    });
  }, [task, form]);

  const queryClient = useQueryClient();
  const updateTaskMutation = useMutation({
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
      setOpen(false);
    },
    onError: () => {
      toast.error(t("edit.toast.error"));
    },
  });

  const onSubmit = (values: z.infer<typeof EditTaskSchema>) => {
    if (values.columnId && values.columnId !== task.columnId) {
      changeCol({
        boardId,
        columnId: task.columnId,
        newColumnId: values.columnId,
        taskId: task.id,
      });
    }

    if (taskManager && boardId && boardId.length > 0) {
      const updatedTask = {
        id: task.id,
        title: values.title,
        description: values.description || "",
        columnId: values.columnId,
        subtasks: values.subtasks,
        index: task.index,
      };

      updateTaskLocal({
        boardId,
        ...updatedTask,
      });
      updateTaskMutation.mutate(updatedTask);
    }
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={setOpen}
      title={t("edit.modalTitle")}
      hideActions
      size="lg"
      className="w-[480px] max-h-[90%] overflow-y-auto p-8"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full h-full items-start justify-between"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={`text-xs font-semibold ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {t("edit.form.titleLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("edit.form.titlePlaceholder")}
                    {...field}
                    className={`w-full h-10 border border-gray-400 rounded-md bg-transparent text-lg font-semibold px-4 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === "light" ? "text-black" : "text-white"
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={`text-xs font-semibold ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {t("edit.form.descriptionLabel")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className={`w-full h-32 border border-gray-400 rounded-md bg-transparent cursor-pointer p-2 resize-none outline-none focus:ring-2 focus:ring-indigo-500 ${
                      theme === "light" ? "text-black" : "text-white"
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.length > 0 && (
            <Label
              className={`text-xs font-semibold ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {t("edit.form.subtasksLabel")}
            </Label>
          )}

          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`subtasks.${index}.title`}
              render={({ field: subtaskField }) => (
                <FormItem className="flex items-center gap-2 w-full">
                  <FormControl>
                    <Input {...subtaskField} className="flex-grow" />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    className="cursor-pointer"
                    onClick={() => remove(index)}
                  >
                    <Icon icon={"mdi:trash-outline"} className="h-4 w-4" />
                  </Button>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            className="w-full h-10 rounded-md bg-[rgb(188,211,232)] text-[#635FC7] text-lg font-semibold cursor-pointer"
            type="button"
            onClick={() =>
              append({
                id: uuid(),
                title: "",
                isCompleted: false,
                index: fields.length,
              })
            }
          >
            {t("edit.form.addSubtaskButton")}
          </Button>

          <FormField
            control={form.control}
            name="columnId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={`text-xs font-semibold ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {t("edit.form.statusLabel")}
                </FormLabel>
                <FormControl>
                  <ReusableSelect
                    label={null}
                    value={field.value}
                    onValueChange={field.onChange}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full h-10 rounded-md bg-[#635FC7] text-white text-lg font-semibold cursor-pointer"
            type="submit"
            disabled={updateTaskMutation.isPending}
          >
            {updateTaskMutation.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("edit.form.saveButton")}
          </Button>
        </form>
      </Form>
    </ReusableDialog>
  );
};
