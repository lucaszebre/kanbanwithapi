import { boardApiServices } from "@/api/board.service";
import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTaskManagerStore } from "@/state/taskManager";
import { AddBoardSchema } from "@/types/AddBoardSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";
import { Icons } from "../common/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const AddBoard = (props: {
  addBoard: boolean;
  setAddBoard: Dispatch<SetStateAction<boolean>>;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation("board");
  const addBoardToStore = useTaskManagerStore((state) => state.addBoard);

  const form = useForm<z.infer<typeof AddBoardSchema>>({
    resolver: zodResolver(AddBoardSchema),
    defaultValues: {
      name: "",
      columns: [{ name: "" }, { name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  useEffect(() => {
    if (props.addBoard) {
      form.reset({
        name: "",
        columns: [{ name: "" }, { name: "" }],
      });
    }
  }, [props.addBoard, form]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (formData: { boardName: string; columns: string[] }) =>
      boardApiServices.createBoard(formData.boardName, formData.columns),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success(t("addBoard.successMessage"));
      props.setAddBoard(false);
    },
    onError: () => {
      toast.error(t("addBoard.errorMessage"));
    },
  });

  const onSubmit = (values: z.infer<typeof AddBoardSchema>) => {
    const columnNames = values.columns.map((col) => col.name);
    addBoardToStore(values.name, columnNames);
    mutation.mutate({ boardName: values.name, columns: columnNames });
  };

  return (
    <ReusableDialog
      open={props.addBoard}
      onOpenChange={props.setAddBoard}
      title={t("addBoard.title")}
      hideActions
      size="lg"
      className="w-[480px] max-h-[90%] overflow-y-auto p-8"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full flex flex-col items-start justify-between"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={`text-sm font-semibold mb-2 ${
                    theme === "light" ? "text-black" : "text-white"
                  }`}
                >
                  {t("addBoard.boardName")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("addBoard.boardNamePlaceholder")}
                    {...field}
                    className={`w-full border rounded-lg bg-transparent text-xl font-semibold px-4 mb-4 cursor-pointer h-10 placeholder:text-gray-400 placeholder:text-base focus:outline-none 
                       
                      }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.length > 0 && (
            <Label
              className={`text-sm font-semibold mb-2 ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {t("addBoard.boardColumns")}
            </Label>
          )}
          <div className="flex flex-col gap-3 w-full py-4">
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
          </div>

          <Button
            type="button"
            className={`w-full h-10 border-none rounded-lg text-xl font-semibold cursor-pointer mb-2 ${
              theme === "light"
                ? "bg-blue-50 text-[#635FC7]"
                : "bg-white text-[#635FC7]"
            }`}
            onClick={() => append({ name: "" })}
          >
            {t("addBoard.addColumn")}
          </Button>
          <Button
            className="w-full h-10 border-none rounded-lg bg-[#635FC7] text-white text-xl font-semibold cursor-pointer mb-2"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("addBoard.createBoard")}
          </Button>
        </form>
      </Form>
    </ReusableDialog>
  );
};
