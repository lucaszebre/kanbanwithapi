import { boardApiServices } from "@/api/board/board.service";
import { useStore } from "@/state/contextopen";
import { useTaskManagerStore } from "@/state/taskManager";
import { useTheme } from "@/state/themecontext";
import styles from "@/styles/Deletethisboard.module.css";
import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const DeleteThisBoard = (props: {
  DeleteBlock: boolean;
  setDeleteBlock: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setCurrentBoardIndex } = useStore(); // state to manage the global data
  const { theme } = useTheme();
  const { currentBoardIndex } = useStore();

  const queryClient = useQueryClient();

  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const delBoard = useTaskManagerStore((state) => state.deleteBoard);

  const mutation = useMutation(
    (boardId: string) => boardApiServices.deleteBoard(boardId),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["boards"]);

        toast.success("Delete the board sucessfully!");
      },
      onError: () => {
        toast.error("Error to delete the board");
      },
    }
  );

  return (
    <div
      className={styles.DeleteThisBoardWrapper}
      style={{ display: props.DeleteBlock ? "flex" : "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setDeleteBlock(false);
        }
      }}
    >
      <div
        className={`${styles.DeletethisBoardDiv} ${
          theme === "light" ? styles.light : styles.dark
        }`}
      >
        <h1 className={styles.DeleteThisBoardTitle}>Delete this board?</h1>
        <p className={styles.DeleteThisBoardText}>
          Are you sure you want to delete the ‘
          <a>{/* { taskManager[0].boards[currentBoardIndex].name } */}</a>’
          board? This action will remove all columns and tasks and cannot be
          reversed.
        </p>
        <div className={styles.DeleteThisBoardButtons}>
          <button
            onClick={async () => {
              try {
                delBoard(taskManager[0].boards[currentBoardIndex]?.id);
                await mutation.mutateAsync(
                  taskManager[0].boards[currentBoardIndex]?.id
                );
                if (taskManager) {
                  setCurrentBoardIndex(0);
                }
              } catch (error) {
                console.error("Error while deleting the board:", error);
              }
              props.setDeleteBlock(false);
            }}
            className={styles.DeleteButton}
          >
            Delete
          </button>
          <button
            className={styles.CancelButton}
            onClick={() => props.setDeleteBlock(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteThisBoard;
