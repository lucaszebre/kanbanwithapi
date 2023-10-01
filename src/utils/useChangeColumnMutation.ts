import { useMutation, useQueryClient } from 'react-query';
import { Task, changeColumn } from './changeColumn';

function useChangeColumnMutation() {
    const queryClient = useQueryClient();

    const column = useMutation(
        (formData: {newColumnId:string,columnId:string,newtask:Task }) =>
        changeColumn(formData.newColumnId,formData.columnId,formData.newtask),
        {
        onSuccess: () => {
            queryClient.invalidateQueries(['boards','Task']);
        },
        }
    );

    return column;
    }

export default useChangeColumnMutation;