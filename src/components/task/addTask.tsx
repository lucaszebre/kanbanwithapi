import { taskApiServices } from "@/api/task.service";
import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTaskManagerStore } from "@/state/taskManager";
import { AddTaskSchema } from "@/types/AddTaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import { Icons } from "../common/icons";
import ReusableSelect from "../reusable/reusable-select";

export const AddTask = ({ children }: { children: ReactNode }) => {
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const addTask = useTaskManagerStore((state) => state.addTask);
  const { t } = useTranslation("task");
  const { boardId: boardIdParams } = useParams();
  const [open, setOpen] = useState(false);

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

  const form = useForm<z.infer<typeof AddTaskSchema>>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      subtasks: [],
      columnId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  useEffect(() => {
    if (currentBoard?.columns?.length) {
      form.setValue("columnId", currentBoard.columns[0].id);
    }
  }, [currentBoard, form]);

  const queryClient = useQueryClient();
  const addTaskMutation = useMutation({
    mutationFn: (
      formData: z.infer<typeof AddTaskSchema> & {
        description: string;
      }
    ) => taskApiServices.createTask(formData),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success(t("add.toast.success"));
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error(t("add.toast.error"));
    },
  });

  const onSubmit = (values: z.infer<typeof AddTaskSchema>) => {
    if (boardId) {
      addTask({
        id: uuidv4(),
        boardId,
        ...values,
        index:
          currentBoard.columns.find((c) => c.id === values.columnId)?.tasks
            .length || 0,
      });
      addTaskMutation.mutate(values);
    } else {
      console.error(t("add.console.submitError"));
    }
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={setOpen}
      title={t("add.modalTitle")}
      className="max-h-[90%] w-[480px] overflow-y-auto"
      showCloseButton
      hideActions
      trigger={children}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full w-full flex-col items-start justify-between gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mb-2 text-xs font-semibold">
                  {t("add.form.titleLabel")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("add.form.titleLabel")}
                    {...field}
                    className="w-full"
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
                <FormLabel className="mb-2 text-xs font-semibold">
                  {t("add.form.descriptionLabel")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("add.form.descriptionLabel")}
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.length > 0 && (
            <FormLabel className="mb-2 text-xs font-semibold">
              {t("add.form.subtasksLabel")}
            </FormLabel>
          )}

          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`subtasks.${index}.title`}
              render={({ field: columnField }) => (
                <FormItem className="flex items-center gap-2 w-full">
                  <FormControl>
                    <Input {...columnField} className="flex-grow" />
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
            variant="outline"
            className="w-full"
            onClick={() =>
              append({
                id: uuidv4(),
                title: "",
                isCompleted: false,
                index: fields.length,
              })
            }
            type="button"
          >
            {t("add.form.addSubtaskButton")}
          </Button>

          <FormField
            control={form.control}
            name="columnId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mb-2 text-xs font-semibold">
                  {t("add.form.statusLabel", "Status")}
                </FormLabel>
                <ReusableSelect
                  onValueChange={field.onChange}
                  value={field.value}
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            type="submit"
            disabled={addTaskMutation.isPending}
          >
            {addTaskMutation.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("add.form.createButton")}
          </Button>
        </form>
      </Form>
    </ReusableDialog>
  );
};
