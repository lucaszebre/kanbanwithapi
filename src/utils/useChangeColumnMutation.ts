import { useMutation, useQueryClient } from 'react-query';
import { Task, changeColumn } from './changeColumn';

function useChangeColumnMutation() {
    const queryClient = useQueryClient();

    const column = useMutation(
        (formData: {newColumnId:string,columnId:string,taskId:string }) =>
        changeColumn(formData.newColumnId,formData.columnId,formData.taskId),
        {
        onSuccess: () => {
            queryClient.refetchQueries(['boards','Task']);
        },
        }
    );

    return column;
    }

export default useChangeColumnMutation;