import { useMutation, useQueryClient } from 'react-query';
import { deleteTask } from './deleteTask';

function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: {boardId:string,columnId:string,taskId:string}) =>
    deleteTask(formData.taskId),
    {
    onSuccess: () => {
        queryClient.invalidateQueries(['boards']);
    },
    }
);

  return mutation;
}

export default useDeleteTaskMutation;