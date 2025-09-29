import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";

export const fetchColumns = async (columnId: string) => {
  try {
    const response = await axiosInstance.get(`/api/columns/${columnId}`);
    if (response) {
      return response;
    } else {
      handleSessionExpiration();
      console.error("Error fetching column");
    }
  } catch (error) {
    console.error(error);
  }
};
