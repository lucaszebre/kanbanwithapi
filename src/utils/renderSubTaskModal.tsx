import { Subtask as Subtasked } from "@/components/task/subTask";
import type { Subtask } from "@/types/global";
type RenderSubTaskProps = {
  subtasks: Subtask[];
  taskId: string;
  boardId: string;
  columnId: string;
};

export const RenderSubTask = ({
  subtasks,
  boardId,
  columnId,
  taskId,
}: RenderSubTaskProps) => {
  if (!subtasks.length) return null;
  return (
    <>
      {subtasks.map((sub, index) => (
        <Subtasked
          key={index}
          taskId={taskId}
          columnId={columnId}
          boardId={boardId}
          subtask={sub}
        />
      ))}
    </>
  );
};
