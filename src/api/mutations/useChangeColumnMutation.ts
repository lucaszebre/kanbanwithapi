import { useMutation, useQueryClient } from "@tanstack/react-query";
import { columnApiServices } from "../column.service";

export const useChangeColumnMutation = () => {
  const queryClient = useQueryClient();

  const column = useMutation({
    mutationFn: (formData: {
      newColumnId: string;
      columnId: string;
      taskId: string;
    }) =>
      columnApiServices.changeColumn(
        formData.newColumnId,
        formData.columnId,
        formData.taskId
      ),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["boards", "Task"] });
    },
  });

  return column;
};
