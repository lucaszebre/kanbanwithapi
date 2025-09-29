import { taskApiServices } from "@/api/task/task.service";
import { useStore } from "@/state/contextopen";
import { useTaskManagerStore } from "@/state/taskManager";
import { useTheme } from "@/state/themecontext";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import styles from "../../styles/DeleteThisTask.module.css";

const DeleteThisTask = (props: {
  TaskTitle: string;
  TaskId: string;
  columnId: string;
}) => {
  const { theme } = useTheme();
  const { DeleteTaskBlock, setDeleteTaskBlock } = useStore();

  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const delTask = useTaskManagerStore((state) => state.deleteTask);

  const { currentBoardIndex } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: { boardId: string; columnId: string; taskId: string }) =>
      taskApiServices.deleteTask(formData.taskId),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["boards"]);
        toast.success("Task delete sucessfully!");
      },
      onError: () => {
        toast.error("Error to delete the task!");
      },
    }
  );
  return (
    <div
      className={styles.DeleteThisTaskWrapper}
      style={{ display: DeleteTaskBlock ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setDeleteTaskBlock(false);
        }
      }}
    >
      <div
        className={`${styles.DeletethisTaskDiv} ${
          theme === "light" ? styles.light : styles.dark
        }`}
      >
        <h1 className={styles.DeleteThisTaskTitle}>Delete this task?</h1>
        <p className={styles.DeleteThisTaskText}>
          Are you sure you want to delete the ‘
          <a
            style={{
              color: "white",
            }}
          >
            {props.TaskTitle}
          </a>
          ’ Task? This action will remove this task and this subtasks and cannot
          be reversed.
        </p>
        <div className={styles.DeleteThisTaskButtons}>
          <button
            onClick={() => {
              delTask(
                taskManager[0].boards[currentBoardIndex].id,
                props.columnId,
                props.TaskId
              );
              mutation.mutate({
                boardId: taskManager[0].boards[currentBoardIndex].id,
                columnId: props.columnId,
                taskId: props.TaskId,
              });
              setDeleteTaskBlock(false);
            }}
            className={styles.DeleteButton}
          >
            Delete
          </button>
          <button
            className={styles.CancelButton}
            onClick={() => setDeleteTaskBlock(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteThisTask;
