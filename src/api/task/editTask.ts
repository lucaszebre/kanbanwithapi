import { SubtaskedType } from "@/types";
import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";

export const editTask = async (
  taskId: string,
  taskName: string,
  taskDescription: string,
  subTasksToAdd: string[],
  subTasksToDelete: string[],
  subTasksToChange: SubtaskedType[]
) => {
  try {
    // Prepare the request body
    const requestBody = {
      updatedTask: {
        title: taskName,
        description: taskDescription,
      },
      subtasksAdd: subTasksToAdd,
      subtasksChangeName: subTasksToChange,
      subtasksToDelete: subTasksToDelete,
    };

    // Make the PUT request using axios
    const response = await axiosInstance.put(
      `/api/tasks/${taskId}`,
      requestBody
    );

    if (response.data) {
      console.log("Edit Task successfully");
    } else {
      handleSessionExpiration();
      console.error("Problem editing the task");
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error:", error);
  }
};
