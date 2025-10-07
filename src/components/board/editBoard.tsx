import { boardApiServices } from "@/api/board.service";
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
import { useTaskManagerStore } from "@/state/taskManager";
import { EditBoardSchema } from "@/types/BoardSchema";
import type { Board, Column } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidV4 } from "uuid";
import type { z } from "zod";
import { Icons } from "../common/icons";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
  const { theme } = useTheme();
  const updateBoardLocal = useTaskManagerStore((state) => state.updateBoard);

  const form = useForm<z.infer<typeof EditBoardSchema>>({
    resolver: zodResolver(EditBoardSchema),
    defaultValues: {
      name: board?.name,
      columns: board?.columns,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  useEffect(() => {
    form.reset({
      name: board?.name,
      columns: board?.columns,
    });
  }, [board, form]);

  const queryClient = useQueryClient();
  const updateBoardMutation = useMutation({
    mutationFn: (formData: { id: string; name: string; columns: Column[] }) =>
      boardApiServices.updateBoard(formData),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success(t("editBoard.successMessage"));
      setEditBoard(false);
    },
    onError: () => {
      toast.error(t("editBoard.errorMessage"));
    },
  });

  const onSubmit = (values: z.infer<typeof EditBoardSchema>) => {
    updateBoardLocal({
      columns: values.columns,
      id: board.id,
      name: values.name,
    });
    updateBoardMutation.mutate({
      id: board.id,
      ...values,
    });
  };

  return (
    <ReusableDialog
      open={editBoard}
      onOpenChange={setEditBoard}
      title={
        <span className="text-black dark:text-white">
          {t("editBoard.title")}
        </span>
      }
      hideActions
      size="lg"
      className="w-[480px] max-h-[90%] overflow-y-auto p-8"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-h-[70vh] overflow-auto gap-2 flex flex-col items-start"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={`mb-2 text-xs font-semibold ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {t("editBoard.boardName")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("editBoard.boardName")}
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

          {fields.length > 0 && (
            <Label
              className={`mb-2 text-xs font-semibold ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {t("editBoard.boardColumns")}
            </Label>
          )}

          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`columns.${index}.name`}
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
            className="w-full h-10 mb-2"
            onClick={() =>
              append({
                id: uuidV4(),
                name: "",
                tasks: [],
                index: fields.length,
              })
            }
            type="button"
          >
            {t("editBoard.addColumn")}
          </Button>

          <Button
            className="w-full"
            type="submit"
            disabled={updateBoardMutation.isPending}
          >
            {updateBoardMutation.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("editBoard.saveChanges")}
          </Button>
        </form>
      </Form>
    </ReusableDialog>
  );
};
