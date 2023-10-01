import { useMutation, useQueryClient } from 'react-query';
import { editTask } from './editTask';
import { Subtasked } from '@/types';

function useEditTaskMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: {taskId:string,taskName:string,taskDescription:string,subTasktoAdd:string[],subTasktoDelete:string[],subTask:Subtasked[]}) =>
    editTask(formData.taskId,formData.taskName,formData.taskDescription,formData.subTasktoAdd,formData.subTasktoDelete,formData.subTask),
    {
    onSuccess: () => {
        queryClient.invalidateQueries(['boards','Task']);
    },
    }
);

  return mutation;
}

export default useEditTaskMutation;