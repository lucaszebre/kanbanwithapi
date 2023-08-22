import React from 'react';
import Subtasks from '@/components/subTask';
import { Subtask } from '@/types';
import { toggleSubtaskCompletion } from '@/utils/ToggleSubtask';
import { useMutation,useQueryClient } from 'react-query';

interface RenderSubTaskProps {
    subtasks: Subtask[];
    currentBoardId: string;
    columnId: string;
    taskId: string;
    setIsMoving: (moving: boolean) => void;
    isMoving: boolean;
}

const RenderSubTask: React.FC<RenderSubTaskProps> = ({ subtasks, currentBoardId, columnId, taskId, setIsMoving, isMoving }) => {
    const queryClient = useQueryClient()
        const mutation = useMutation(
            (formdata:{ isCompleted:boolean, currentBoardId:string, columnId:string, taskId:string, subtaskId:string }) =>
            toggleSubtaskCompletion(formdata.isCompleted, formdata.currentBoardId, formdata.columnId, formdata.taskId, formdata.subtaskId),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['Boards']);
            },
            }
        );
    if (subtasks) {
        return (
            <>
                {subtasks.map((sub, index) => (
                    <Subtasks
                        key={index}
                        title={sub.title}
                        checked={sub.isCompleted}
                        onClick={() => {
                            mutation.mutate({isCompleted:sub.isCompleted,currentBoardId, columnId, taskId,subtaskId: sub._id});
                            setIsMoving(!isMoving);
                        }}
                    />
                ))}
            </>
        );
    } else {
        return null;
    }
};

export default RenderSubTask;