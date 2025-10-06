import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApiServices } from "../task.service";

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: {
      boardId: string;
      columnId: string;
      taskId: string;
    }) => taskApiServices.deleteTask(formData.taskId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards"] });
    },
  });

  return mutation;
};
