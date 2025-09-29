import { Subtask } from "@/types/Zodtype";
import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";

export interface Task {
  id: string;
  title: string;
  status: string;
  description: string;
  subtasks: Subtask[];
}
export const changeColumn = async (
  newColumnId: string,
  columnId: string,
  taskId: string
) => {
  if (newColumnId !== columnId) {
    try {
      const response = await axiosInstance.put(
        `/api/tasks/${taskId}/column/${newColumnId}`
      );
      if (response) {
        return response;
      } else {
        console.error("Error changing column name");
        handleSessionExpiration();
      }
    } catch (error) {
      handleSessionExpiration();
      console.error("message", "Internal server error");
    }
  }
};
