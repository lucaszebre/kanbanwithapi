import { Subtask } from "@/types/Zodtype";
import { handleSessionExpiration } from "./common/handleSessionexpiration";
import { axiosInstance } from "./common/instance";

// Column route constants
const COLUMN_ROUTE = "api/columns";
const BOARD_ROUTE = "api/boards";

// Task interface for column operations
export interface Task {
  id: string;
  title: string;
  status: string;
  description: string;
  subtasks: Subtask[];
}

const addColumn = async (boardId: string, columnName: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `/${BOARD_ROUTE}/${boardId}/columns`,
      {
        name: columnName,
      }
    );
    if (response) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error adding column");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error adding column:", error);
    return null;
  }
};

const changeColumn = async (
  newColumnId: string,
  columnId: string,
  taskId: string
) => {
  if (newColumnId !== columnId) {
    try {
      const response = await axiosInstance.patch(
        `/api/tasks/${taskId}/column/${newColumnId}`
      );
      if (response.data) {
        return response.data;
      } else {
        handleSessionExpiration();
        console.error("Error changing column");
        return null;
      }
    } catch (error) {
      handleSessionExpiration();
      console.error("Error changing column:", error);
      return null;
    }
  }
  return null;
};

const changeColumnName = async (columnId: string, newName: string) => {
  try {
    const response = await axiosInstance.patch(`/${COLUMN_ROUTE}/${columnId}`, {
      name: newName,
    });

    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error changing column name");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error changing column name:", error);
    return null;
  }
};

const deleteColumn = async (columnId: string) => {
  try {
    const response = await axiosInstance.delete(`/${COLUMN_ROUTE}/${columnId}`);
    if (response) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error deleting column");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error deleting column:", error);
    return null;
  }
};

const fetchColumns = async (boardId: string) => {
  try {
    const response = await axiosInstance.get(
      `/${BOARD_ROUTE}/${boardId}/columns`
    );
    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error fetching columns");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error fetching columns:", error);
    return null;
  }
};

const getColumn = async (columnId: string) => {
  try {
    const response = await axiosInstance.get(`/${COLUMN_ROUTE}/${columnId}`);
    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error getting column");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error getting column:", error);
    return null;
  }
};

export const columnApiServices = {
  addColumn,
  changeColumn,
  changeColumnName,
  deleteColumn,
  fetchColumns,
  getColumn,
};
