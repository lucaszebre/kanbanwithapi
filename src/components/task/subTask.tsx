import { taskApiServices } from "@/api/task.service";
import { useTaskManagerStore } from "@/state/taskManager";
import type { Subtask as SubTaskType } from "@/types/global";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const Subtask = ({
  subtask,
  taskId,
  columnId,
  boardId,
}: {
  subtask: SubTaskType;
  taskId: string;
  columnId: string;
  boardId: string;
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(subtask.isCompleted);
  const toggle = useTaskManagerStore((state) => state.toggleSubtask);

  const mutation = useMutation({
    mutationFn: (formData: { isCompleted: boolean; subtaskId: string }) =>
      taskApiServices.toggleSubtaskCompletion(
        formData.subtaskId,
        formData.isCompleted
      ),
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);

    toggle({
      boardId,
      columnId,
      taskId,
      isCompleted: !isChecked,
      subtaskId: subtask.id,
    });

    mutation.mutate({ isCompleted: !isChecked, subtaskId: subtask.id });
  };

  const baseClasses =
    "w-full flex flex-row items-center justify-start gap-4 mb-4 rounded-md  transition-colors";
  const textClasses = isChecked ? "line-through text-[#BDBDBD]" : "";

  return (
    <div className={`${baseClasses} `}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="cursor-pointer accent-[#635FC7]"
      />
      <p className={`text-sm font-medium ${textClasses}`}>{subtask.title}</p>
    </div>
  );
};
