import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";

function createSubTaskArray(SubTaskCurrent: string[]) {
  const SubtaskArray = [];

  for (const columnName of SubTaskCurrent) {
    const subtask = {
      title: columnName,
      isCompleted: false,
    };
    SubtaskArray.push(subtask);
  }

  return SubtaskArray;
}
export const createTask = async (
  taskTitle: string,
  taskDescription: string,
  columnId: string,
  SubTaskCurrent?: string[]
) => {
  try {
    // User is authenticated, check if a row exists in the "User" table

    const response = await axiosInstance.post(
      `/api/columns/${columnId}/tasks`,
      {
        title: taskTitle,
        description: taskDescription,
        subtasks: SubTaskCurrent,
      }
    );
    if (response.data) {
      console.log("Task add");
    } else {
      handleSessionExpiration();
      console.error("Problem to task the boards");
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("message", error);
  }
};
