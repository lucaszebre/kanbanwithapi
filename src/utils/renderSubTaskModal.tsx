import React from 'react';
import Subtasks from '@/components/subTask';
import { Subtask } from '@/types';

interface RenderSubTaskProps {
    subtasks: Subtask[];
    currentBoardId: string;
    columnId: string;
    taskId: string;
}

const RenderSubTask: React.FC<RenderSubTaskProps> = ({ subtasks, currentBoardId, columnId, taskId }) => {
    
    if (subtasks) {
        return (
            <>
                {subtasks.map((sub, index) => (
                    
                    <Subtasks
                        key={index}
                        title={sub.title}
                        checked={sub.isCompleted}
                        colunmId={columnId}
                        taskId={taskId}
                        subtaskId={sub.id}
                    />
                ))}
            </>
        );
    } else {
        return null;
    }
};

export default RenderSubTask;