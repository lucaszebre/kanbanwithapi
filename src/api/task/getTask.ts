import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";

export const getTask = async (taskId: string) => {
  try {
    const response = await axiosInstance.get(`/api/tasks/${taskId}`);
    if (response) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error fetching boards");
    }
  } catch (error) {
    handleSessionExpiration();
    console.error(error);
  }
};
