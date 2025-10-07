import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import ReusableSelect from "@/components/reusable/reusable-select";
import { useTaskManagerStore } from "@/state/taskManager";
import { RenderSubTask } from "@/utils/renderSubTaskModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { DeleteThisTask } from "../delete/DeletethisTask";
import { EditTask } from "../task/editTask";
// Removed ModalAboutTask dropdown; inline action icons instead
import { taskApiServices } from "@/api/task.service";
import type { Subtask, Task } from "@/types/global";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../ui/button";

export const ModalTask = ({
  task,
  open,
  setOpen,
}: {
  task: Task;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { boardId: boardIdParams } = useParams();
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const changeCol = useTaskManagerStore((state) => state.changeCol);
  const updateTaskLocal = useTaskManagerStore((state) => state.updateTask);

  const [selectedColumnId, setSelectedColumnId] = useState(task.columnId);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [openDeleteTask, setOpenDeleteTask] = useState(false);

  const boardId = useMemo(
    () => boardIdParams ?? taskManager?.boards?.[0]?.id ?? "",
    [boardIdParams, taskManager]
  );
  const currentBoard = useMemo(() => {
    return (
      taskManager?.boards?.find((board) => board.id === boardId) ??
      taskManager?.boards?.[0] ??
      null
    );
  }, [boardId, taskManager]);

  const queryClient = useQueryClient();
  const { t } = useTranslation("task");

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

  if (!task) return <></>;

  const headerClasses = "w-full flex items-center justify-between";
  const titleClasses = "text-lg font-semibold";
  const descClasses = "text-sm font-semibold text-left";
  const h2Classes = "text-xs font-semibold";

  return (
    <>
      <EditTask task={task} open={openEditTask} setOpen={setOpenEditTask} />
      <DeleteThisTask
        id={task.id}
        columnId={task.columnId}
        title={task.title}
        open={openDeleteTask}
        setOpen={setOpenDeleteTask}
      />
      <ReusableDialog
        open={open}
        onOpenChange={async (open) => {
          setOpen(open);

          if (selectedColumnId && selectedColumnId !== task.columnId) {
            changeCol({
              boardId,
              columnId: task.columnId,
              newColumnId: selectedColumnId,
              taskId: task.id,
            });
            updateTaskLocal({
              boardId,
              ...task,
              columnId: selectedColumnId,
            });
            updateTask.mutate({
              ...task,
              columnId: selectedColumnId,
            });
          }
        }}
        hideActions
        size="lg"
        className="max-h-[90%] w-[480px] overflow-y-auto"
      >
        <div className={headerClasses}>
          <h1 className={titleClasses}>{task.title}</h1>
          <div className="flex items-center gap-3">
            <Button
              variant={"outline"}
              type="button"
              onClick={() => {
                // mimic previous edit path
                setOpenEditTask(true);
                setOpen(false);
              }}
              aria-label={t("actions.editAria")}
              className="p-2 rounded-md cursor-pointer"
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setOpenDeleteTask(true);
                setOpen(false);
              }}
              aria-label={t("actions.deleteAria")}
              className="p-2 rounded-md cursor-pointer  text-[#ea5555] transition-colors"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <p className={descClasses}>
          {task.description || t("view.noDescription")}
        </p>
        {task.subtasks.length > 0 && (
          <h2 className={h2Classes}>{t("view.subtasksHeading")}</h2>
        )}
        <RenderSubTask
          boardId={currentBoard?.id}
          columnId={selectedColumnId}
          taskId={task.id}
          subtasks={task.subtasks}
        />
        <h2 className={h2Classes}>{t("view.currentStatusHeading")}</h2>
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
          className="mt-1"
        />
      </ReusableDialog>
    </>
  );
};
