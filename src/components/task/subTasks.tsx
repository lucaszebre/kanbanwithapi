import type { Subtask } from "@/types/global";
import { BoardColumn } from "../board/boardColumn";

type SubTaskProps = {
  subTasks: Subtask[];
  handleSubTaskDelete: (index: number) => void;
  handleColumnTitleChange: (index: number, updatedTitle: string) => void;
  columnErrors: boolean[];
};

export const SubTasks = ({
  subTasks,
  handleSubTaskDelete,
  handleColumnTitleChange,
  columnErrors,
}: SubTaskProps) => {
  return (
    <div className="flex flex-col gap-4 w-full pb-4">
      {subTasks.map((subtask, index) => (
        <BoardColumn
          key={subtask.id}
          title={subtask.title}
          Remove={() => handleSubTaskDelete(index)}
          onChange={(updatedTitle: string) =>
            handleColumnTitleChange(index, updatedTitle)
          }
          error={columnErrors[index] || false}
        />
      ))}
    </div>
  );
};
