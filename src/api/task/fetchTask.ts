import { axiosInstance } from "../common/instance";

export const fetchTask = async (taskId: string) => {
  try {
    // Check if localStorage is available (client-side)

    const response = await axiosInstance.get(`/api/tasks/${taskId}`);
    if (response) {
      return response.data;
    } else {
      console.error("Error fetching boards");
    }
  } catch (error) {
    console.error(error);
  }
};
