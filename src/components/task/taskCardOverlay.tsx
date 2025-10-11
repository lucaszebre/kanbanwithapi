import type { Task } from "@/types/global";
import { Card } from "../ui/card";

// Lightweight, stateless card for DragOverlay usage
export const TaskCardOverlay = (task: Task) => {
  const completed = (() => {
    let i = 0;
    if (task.subtasks) {
      for (const sub of task.subtasks) {
        if (sub.isCompleted) i++;
      }
    }
    return i;
  })();

  const containerBase =
    "rounded-lg px-4 py-2 w-[280px] text-left mb-4 shadow-sm";
  const titleClasses = "text-lg font-semibold mb-4";
  const subTextClasses = "text-gray-500 text-sm font-semibold mb-4";

  return (
    <Card className={containerBase}>
      <h1 className={titleClasses}>{task.title}</h1>
      <p className={subTextClasses}>
        {completed}/{task.subtasks?.length ?? 0} subtasks
      </p>
    </Card>
  );
};
