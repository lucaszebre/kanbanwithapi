import { axiosInstance } from "../common/instance";

export const deleteBoard = async (boardId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/boards/${boardId}`);
    if (response) {
      return response;
    } else {
      console.error("Error deleting Board");
    }
  } catch (error) {}
};
