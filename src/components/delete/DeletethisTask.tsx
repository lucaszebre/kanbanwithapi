import { taskApiServices } from "@/api/task.service";
import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import { useTaskManagerStore } from "@/state/taskManager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export const DeleteThisTask = ({
  title,
  id,
  columnId,
  children,
}: {
  title: string;
  id: string;
  columnId: string;
  children: ReactNode;
}) => {
  const { t } = useTranslation("task");
  const { boardId } = useParams();
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const deleteTask = useTaskManagerStore((state) => state.deleteTask);
  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: {
      boardId: string;
      columnId: string;
      taskId: string;
    }) => taskApiServices.deleteTask(formData.taskId),

    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
    },
    onError: () => {
      toast.error(t("delete.toast.error"));
    },
  });
  return (
    <ReusableDialog
      trigger={children}
      title={t("delete.modalTitle")}
      description={
        <span className="text-left block">
          {t("delete.description", { title })}
        </span>
      }
      variant="destructive"
      size="md"
      confirmLabel={t("delete.buttons.confirm")}
      cancelLabel={t("delete.buttons.cancel")}
      onConfirm={() => {
        deleteTask({ boardId: currentBoard?.id, columnId, id });
        mutation.mutate({
          boardId: currentBoard?.id,
          columnId: columnId,
          taskId: id,
        });
      }}
      className="w-[480px]"
    />
  );
};
