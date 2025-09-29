import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";

export const fetchBoards = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/api/boards`);
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
