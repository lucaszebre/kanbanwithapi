import { taskApiServices } from "@/api/task/task.service";
import { useTaskManagerStore } from "@/state/taskManager";
import { useTheme } from "@/state/themecontext";
import styles from "@/styles/Subtasks.module.css";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

export const Subtasks = (props: {
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
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: { isCompleted: boolean; subtaskId: string }) =>
      taskApiServices.toggleSubtaskCompletion(
        formData.subtaskId,
        formData.isCompleted
      ),
    {}
  );

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

  return (
    <div
      className={`${styles.SubtasksDiv} ${
        theme === "light" ? styles.light : styles.dark
      }`}
      style={{
        height: isChecked ? "40px" : "auto",
      }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <p
        className={styles.SubtaskTitle}
        style={{
          textDecoration: isChecked ? "line-through" : "none",
          color: isChecked ? "#BDBDBD" : "white",
        }}
      >
        {props.title}
      </p>
    </div>
  );
};
