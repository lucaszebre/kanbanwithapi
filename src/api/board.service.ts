import { handleSessionExpiration } from "./common/handleSessionexpiration";
import { axiosInstance } from "./common/instance";

// Board route constants
const BOARD_ROUTE = "api/boards";

// Helper type for column data
type ColumnData = {
  id: string;
  name: string;
};

const createBoard = async (boardName: string, columnsName: string[]) => {
  try {
    const response = await axiosInstance.post(`/${BOARD_ROUTE}`, {
      name: boardName,
      columns: columnsName,
    });

    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error creating board");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error creating board:", error);
    return null;
  }
};

const fetchBoards = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/${BOARD_ROUTE}`);
    return response.data;
  } catch (error) {
    handleSessionExpiration();
    console.error("Error fetching boards:", error);
    return null;
  }
};

const deleteBoard = async (boardId: string) => {
  try {
    const response = await axiosInstance.delete(`/${BOARD_ROUTE}/${boardId}`);
    return response.data;
  } catch (error) {
    handleSessionExpiration();
    console.error("Error deleting board:", error);
    return null;
  }
};

const changeBoardName = async (boardId: string, newName: string) => {
  try {
    const response = await axiosInstance.patch(`/${BOARD_ROUTE}/${boardId}`, {
      name: newName,
    });

    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error changing board name");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error changing board name:", error);
    return null;
  }
};

const updateBoard = async (data: {
  id: string;
  name: string;
  columns?: ColumnData[];
}) => {
  try {
    const response = await axiosInstance.patch(
      `/${BOARD_ROUTE}/${data.id}`,
      data
    );

    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error editing board");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error editing board:", error);
    return null;
  }
};

export const boardApiServices = {
  createBoard,
  fetchBoards,
  deleteBoard,
  changeBoardName,
  updateBoard,
};
