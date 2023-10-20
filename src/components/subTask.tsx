import React from 'react';
import styles from '@/styles/Subtasks.module.css';
import { useTheme } from '@/state/themecontext';
import { toggleSubtaskCompletion } from '@/utils/ToggleSubtask';
import { useMutation, useQueryClient } from 'react-query';
import { useTaskManagerStore } from '@/state/taskManager';

const Subtasks = (props: {
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
      toggleSubtaskCompletion(formData.isCompleted, formData.subtaskId),
    {
      onSuccess: () => {
        // Invalidate queries as needed after backend update
        queryClient.invalidateQueries(['Task', 'boards']);
      },
    }
  );

  const handleCheckboxChange = () => {
    // First, update local state
    setIsChecked(!isChecked);
    
    // Then, update Zustand store or global state
    toggle(props.boardId, props.columnId, props.taskId, props.subtaskId, !isChecked);

    // Lastly, initiate backend mutation
    mutation.mutate({ isCompleted: !isChecked, subtaskId: props.subtaskId });
  };

  return (
    <div
      className={`${styles.SubtasksDiv} ${
        theme === 'light' ? styles.light : styles.dark
      }`}
      style={{
        height: isChecked ? '40px' : 'auto',
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
          textDecoration: isChecked ? 'line-through' : 'none',
          color: isChecked ? '#BDBDBD' : 'white',
        }}
      >
        {props.title}
      </p>
    </div>
  );
};

export default Subtasks;
