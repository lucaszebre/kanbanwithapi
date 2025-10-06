import { columnApiServices } from "@/api/column.service";
import { ReusableDialog } from "@/components/reusable/reusable-dialog";
import ReusableSelect from "@/components/reusable/reusable-select";
import { useTaskManagerStore } from "@/state/taskManager";
import RenderSubTask from "@/utils/renderSubTaskModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { DeleteThisTask } from "../delete/DeletethisTask";
import { EditTask } from "../task/editTask";
// Removed ModalAboutTask dropdown; inline action icons instead
import type { TaskType } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "react-router";
import { Button } from "../ui/button";

export const ModalTask = ({
  task,
  open,
  setOpen,
}: {
  task: TaskType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { boardId } = useParams();
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const changeCol = useTaskManagerStore((state) => state.changeCol);
  const [selectedColumnId, setSelectedColumnId] = useState(task.columnId);
  // no about modal anymore
  const [openEditTask, setOpenEditTask] = useState(false);
  const [openDeleteTask, setOpenDeleteTask] = useState(false);
  const currentBoard = useMemo(() => {
    return (
      taskManager[0].boards.find((board) => board.id === boardId) ??
      taskManager[0].boards[0] ??
      null
    );
  }, [boardId, taskManager]);

  const queryClient = useQueryClient();
  const { t } = useTranslation("task");
  const column = useMutation({
    mutationFn: (formData: {
      newColumnId: string;
      columnId: string;
      taskId: string;
    }) =>
      columnApiServices.changeColumn(
        formData.newColumnId,
        formData.columnId,
        formData.taskId
      ),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
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
          if (!open) {
            // closing logic replicates previous click-away behavior
            if (selectedColumnId && selectedColumnId !== task.columnId) {
              changeCol(selectedColumnId, task.columnId, task.id);
              column.mutate({
                newColumnId: selectedColumnId,
                columnId: task.columnId,
                taskId: task.id,
              });
              queryClient.refetchQueries({ queryKey: ["boards"] });
            }
          }
        }}
        title={null}
        description={null}
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
