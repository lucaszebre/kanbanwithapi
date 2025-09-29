import { useMutation, useQueryClient } from "react-query";
import { taskApiServices } from "../task/task.service";

function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: { boardId: string; columnId: string; taskId: string }) =>
      taskApiServices.deleteTask(formData.taskId),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["boards"]);
      },
    }
  );

  return mutation;
}

export default useDeleteTaskMutation;
