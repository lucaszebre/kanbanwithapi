import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";
export const changeColumnName = async (
  columnId: string,
  name: string
): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/api/columns/${columnId}`, {
      name: name,
    });
    if (response) {
      return response;
    } else {
      handleSessionExpiration();
      console.error("Error changing column name");
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("message", "Internal server error");
  }
};
