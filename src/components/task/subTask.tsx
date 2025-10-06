import { taskApiServices } from "@/api/task.service";
import { useTaskManagerStore } from "@/state/taskManager";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React from "react";

export const Subtask = (props: {
  title: string;
  checked: boolean;
  subtaskId: string;
  taskId: string;
  columnId: string;
  boardId: string;
}) => {
  const { theme } = useTheme();
  const [isChecked, setIsChecked] = React.useState<boolean>(props.checked);
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

    toggle(
      props.boardId,
      props.columnId,
      props.taskId,
      props.subtaskId,
      !isChecked
    );

    mutation.mutate({ isCompleted: !isChecked, subtaskId: props.subtaskId });
  };

  const baseClasses =
    "w-full flex flex-row items-center justify-start gap-4 mb-4 rounded-md p-4 transition-colors";
  const themeBg = theme === "light" ? "bg-[rgb(222,237,249)]" : "bg-[#20212C]";
  const textClasses = isChecked
    ? "line-through text-[#BDBDBD]"
    : theme === "light"
    ? "text-black"
    : "text-white";

  return (
    <div
      className={`${baseClasses} ${themeBg}`}
      style={{ height: isChecked ? "40px" : "auto" }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="cursor-pointer accent-[#635FC7]"
      />
      <p className={`text-sm font-medium ${textClasses}`}>{props.title}</p>
    </div>
  );
};
