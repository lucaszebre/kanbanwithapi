import { Subtask } from "@/components/task/subTask";
import type { SubtaskType } from "@/types";
import React from "react";
interface RenderSubTaskProps {
  subtasks: SubtaskType[];
  boardId: string;
  columnId: string;
}

const RenderSubTask: React.FC<RenderSubTaskProps> = ({
  subtasks,
  boardId,
  columnId,
}) => {
  if (subtasks) {
    return (
      <>
        {subtasks.map((sub, index) => (
          <Subtask
            key={index}
            title={sub.title}
            checked={sub.isCompleted}
            subtaskId={sub.id}
            taskId={sub.taskId}
            columnId={columnId}
            boardId={boardId}
          />
        ))}
      </>
    );
  } else {
    return null;
  }
};

export default RenderSubTask;
