import type { SubtaskedType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApiServices } from "../task.service";

export const useEditTaskMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: {
      taskId: string;
      taskName: string;
      taskDescription: string;
      subTasktoAdd: string[];
      subTasktoDelete: string[];
      subTask: SubtaskedType[];
    }) =>
      taskApiServices.editTask(
        formData.taskId,
        formData.taskName,
        formData.taskDescription,
        formData.subTasktoAdd,
        formData.subTasktoDelete,
        formData.subTask
      ),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards", "Task"] });
    },
  });

  return mutation;
};
