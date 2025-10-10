import type { Column, Task } from "@/types/global";
import { handleSessionExpiration } from "./common/handleSessionexpiration";
import { axiosInstance } from "./common/instance";

// Column route constants
const COLUMN_ROUTE = "api/columns";
const BOARD_ROUTE = "api/boards";

const addColumn = async (boardId: string, columnName: string) => {
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

const updateColumns = async (data: { boardId: string; columns: Column[] }) => {
  try {
    const response = await axiosInstance.patch(
      `/${BOARD_ROUTE}/${data.boardId}/columns`,
      {
        columns: data.columns,
      }
    );

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

const updateColumn = async (data: {
  id: string;
  name: string;
  index: number;
  tasks?: Task[];
}) => {
  try {
    const response = await axiosInstance.patch(`/${COLUMN_ROUTE}/${data.id}`, {
      name: data.name,
      index: data.index,
      tasks: data.tasks,
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
  updateColumn,
  deleteColumn,
  fetchColumns,
  getColumn,
  updateColumns,
};
