// Backward-compatible wrapper around the new ReusableAlertDialog.
// Keeps the same props so existing imports continue to work.
import { boardApiServices } from "@/api/board.service";
import { ReusableAlertDialog } from "@/components/reusable/reusable-alert-dialog";
import { useTaskManagerStore } from "@/state/taskManager";
import { IdtoBoarName } from "@/utils/IdtoBoarName";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

export const DeleteThisBoard = ({ children }: { children: ReactNode }) => {
  const { boardId: boardIdParams } = useParams();
  const { t } = useTranslation("board");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const taskManager = useTaskManagerStore((s) => s.taskManager);
  const deleteBoard = useTaskManagerStore((s) => s.deleteBoard);

  const boardId = useMemo(
    () => boardIdParams ?? taskManager?.boards?.[0]?.id ?? "",
    [boardIdParams, taskManager]
  );
  const currentBoardName = useMemo(
    () =>
      IdtoBoarName(boardId, taskManager?.boards) ||
      t("deleteBoard.unknownBoard"),
    [boardId, taskManager, t]
  );

  const mutation = useMutation({
    mutationFn: (id: string) => boardApiServices.deleteBoard(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
      toast.success(t("deleteBoard.successMessage"));
      navigate("/");
    },
    onError: () => {
      toast.error(t("deleteBoard.errorMessage"));
    },
  });

  return (
    <ReusableAlertDialog
      variant="destructive"
      title={t("deleteBoard.title") as string}
      description={
        t("deleteBoard.confirmMessage", {
          boardName: currentBoardName,
        }) as string
      }
      confirmLabel={t("deleteBoard.deleteButton") as string}
      cancelLabel={t("deleteBoard.cancelButton") as string}
      trigger={children}
      onConfirm={async () => {
        if (!boardId) return;
        try {
          deleteBoard(boardId); // optimistic local removal
          await mutation.mutateAsync(boardId);
        } catch (err) {
          console.error("Delete board failed", err);
        }
      }}
    />
  );
};
