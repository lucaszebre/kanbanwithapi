import { Subtask, Subtasked, Task } from '@/types';
import { axiosInstance } from './instance';

export const editTask = async (
  taskId: string,
  taskName: string,
  taskDescription: string,
  subTasksToAdd: string[],
  subTasksToDelete: string[],
  subTasksToChange: Subtasked[]
) => {
  try {
    // Prepare the request body
    const requestBody = {
      Task: {
        title: taskName,
        description: taskDescription,
      },
      subtasksToAdd: subTasksToAdd,
      subtasksToChange: subTasksToChange,
      subtasksToDelete: subTasksToDelete,
    };

    // Make the PUT request using axios
    const response = await axiosInstance.put(`/tasks/${taskId}`, requestBody);

    if (response.data) {
      console.log('Edit Task successfully');
    } else {
      console.error('Problem editing the task');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
