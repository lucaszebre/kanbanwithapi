import type { Task } from "@/types/global";
import { useSortable } from "@dnd-kit/react/sortable";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalTask } from "../modal/modalTask";
import { Card } from "../ui/card";

export const TaskCard = (task: Task) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("task");

  const { ref, isDragging } = useSortable({
    id: task.id,
    index: task.index,
    type: "item",
    accept: "item",
    group: task.columnId,
  });

  function Iscompleted() {
    let i = 0;
    if (task.subtasks) {
      for (const sub of task.subtasks) {
        if (sub.isCompleted) i++;
      }
    }
    return i;
  }

  const containerBase =
    "cursor-pointer rounded-lg px-4 py-2 w-[280px] text-left mb-4 shadow-sm hover:shadow-md transition-shadow";

  const titleClasses =
    "text-lg font-semibold mb-4 hover:text-[#3F51B5] transition-colors ";
  const subTextClasses = "text-gray-500 text-sm font-semibold mb-4";

  return (
    <div ref={ref} data-dragging={isDragging}>
      <ModalTask task={task} open={open} setOpen={setOpen} />
      <Card
        className={`${containerBase}`}
        onClick={() => {
          if (isDragging) return;
          setOpen(true);
        }}
      >
        <h1 className={titleClasses}>{task.title}</h1>
        <p className={subTextClasses}>
          {t("card.progress", {
            completed: Iscompleted(),
            total: task.subtasks.length,
          })}
        </p>
      </Card>
    </div>
  );
};
