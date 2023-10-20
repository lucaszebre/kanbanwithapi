import React from 'react';
import Subtasks from '@/components/subTask';
import { Subtask } from '@/types';
interface RenderSubTaskProps {
    subtasks: Subtask[];
    boardId:string;
    columnId:string;
}

const RenderSubTask: React.FC<RenderSubTaskProps> = ({ subtasks,boardId,columnId}) => {
    
    if (subtasks) {
        return (
            <>
                {subtasks.map((sub, index) => (
                    
                    <Subtasks
                        key={index}
                        title={sub.title}
                        checked={sub.isCompleted}
                        subtaskId={sub.id}
                        taskId={sub.taskId}
                        columnId={columnId}
                        boardId={boardId}


                    />
                ))}
            </>
        );
    } else {
        return null;
    }
};

export default RenderSubTask;