import { useMutation, useQueryClient } from "react-query";
import { columnApiServices } from "../column/column.service";

function useChangeColumnMutation() {
  const queryClient = useQueryClient();

  const column = useMutation(
    (formData: { newColumnId: string; columnId: string; taskId: string }) =>
      columnApiServices.changeColumn(
        formData.newColumnId,
        formData.columnId,
        formData.taskId
      ),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["boards", "Task"]);
      },
    }
  );

  return column;
}

export default useChangeColumnMutation;
