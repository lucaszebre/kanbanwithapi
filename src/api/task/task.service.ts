import { Subtasked } from "@/types";
import { handleSessionExpiration } from "../common/handleSessionexpiration";
import { axiosInstance } from "../common/instance";

// Task route constants
const TASK_ROUTE = "api/tasks";

// Helper function for creating subtask array
const createSubTaskArray = (SubTaskCurrent: string[]) => {
  const SubtaskArray = [];

  for (const columnName of SubTaskCurrent) {
    const subtask = {
      title: columnName,
      isCompleted: false,
    };
    SubtaskArray.push(subtask);
  }

  return SubtaskArray;
};

const createTask = async (
  taskTitle: string,
  taskDescription: string,
  columnId: string,
  SubTaskCurrent?: string[]
) => {
  try {
    const response = await axiosInstance.post(
      `/api/columns/${columnId}/tasks`,
      {
        title: taskTitle,
        description: taskDescription,
        subtasks: SubTaskCurrent,
      }
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

const editTask = async (
  taskId: string,
  taskName: string,
  taskDescription: string,
  subTasksToAdd: string[],
  subTasksToDelete: string[],
  subTask: Subtasked[]
) => {
  try {
    const response = await axiosInstance.put(`/${TASK_ROUTE}/${taskId}`, {
      title: taskName,
      description: taskDescription,
      subtasksToAdd: subTasksToAdd,
      subtasksToDelete: subTasksToDelete,
      subtasks: subTask,
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
    const response = await axiosInstance.put(`/api/subtasks/${subtaskId}`, {
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
