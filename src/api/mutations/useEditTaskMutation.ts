import { Subtasked } from "@/types";
import { useMutation, useQueryClient } from "react-query";
import { taskApiServices } from "../task/task.service";

function useEditTaskMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: {
      taskId: string;
      taskName: string;
      taskDescription: string;
      subTasktoAdd: string[];
      subTasktoDelete: string[];
      subTask: Subtasked[];
    }) =>
      taskApiServices.editTask(
        formData.taskId,
        formData.taskName,
        formData.taskDescription,
        formData.subTasktoAdd,
        formData.subTasktoDelete,
        formData.subTask
      ),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["boards", "Task"]);
      },
    }
  );

  return mutation;
}

export default useEditTaskMutation;
