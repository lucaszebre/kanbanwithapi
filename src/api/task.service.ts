import type { Subtask } from "@/types/global";
import { handleSessionExpiration } from "./common/handleSessionexpiration";
import { axiosInstance } from "./common/instance";

const TASK_ROUTE = "api/tasks";

const createTask = async ({
  columnId,
  ...data
}: {
  title: string;
  description: string;
  columnId: string;
  subtasks?: Subtask[];
}) => {
  try {
    const response = await axiosInstance.post(
      `/api/columns/${columnId}/tasks`,
      data
    );

    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error creating task");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error creating task:", error);
    return null;
  }
};

const deleteTask = async (taskId: string) => {
  try {
    const response = await axiosInstance.delete(`/${TASK_ROUTE}/${taskId}`);
    if (response) {
      console.log(response.status);
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error deleting task");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error deleting task:", error);
    return null;
  }
};

const editTask = async (data: {
  id: string;
  title: string;
  description: string;
  columnId: string;
  subtasks: Subtask[];
}) => {
  try {
    const response = await axiosInstance.patch(`/${TASK_ROUTE}/${data.id}`, {
      ...data,
    });

    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error editing task");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error editing task:", error);
    return null;
  }
};

const fetchTask = async (taskId: string) => {
  try {
    const response = await axiosInstance.get(`/${TASK_ROUTE}/${taskId}`);
    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error fetching task");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error fetching task:", error);
    return null;
  }
};

const getTask = async (taskId: string) => {
  try {
    const response = await axiosInstance.get(`/${TASK_ROUTE}/${taskId}`);
    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error getting task");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error getting task:", error);
    return null;
  }
};

const toggleSubtaskCompletion = async (
  subtaskId: string,
  isCompleted: boolean
) => {
  try {
    const response = await axiosInstance.patch(`/api/subtasks/${subtaskId}`, {
      isCompleted: isCompleted,
    });

    if (response.data) {
      return response.data;
    } else {
      handleSessionExpiration();
      console.error("Error toggling subtask");
      return null;
    }
  } catch (error) {
    handleSessionExpiration();
    console.error("Error toggling subtask:", error);
    return null;
  }
};

export const taskApiServices = {
  createTask,
  deleteTask,
  editTask,
  fetchTask,
  getTask,
  toggleSubtaskCompletion,
};
