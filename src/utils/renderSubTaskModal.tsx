import React from 'react';
import Subtasks from '@/components/subTask';
import { Subtask } from '@/types';

interface RenderSubTaskProps {
    subtasks: Subtask[];
    currentBoardId: string;
    columnId: string;
    taskId: string;
    setIsMoving: (moving: boolean) => void;
    isMoving: boolean;
}

const RenderSubTask: React.FC<RenderSubTaskProps> = ({ subtasks, currentBoardId, columnId, taskId, setIsMoving, isMoving }) => {
    
    if (subtasks) {
        return (
            <>
                {subtasks.map((sub, index) => (
                    console.log(sub),
                    <Subtasks
                        key={index}
                        title={sub.title}
                        checked={sub.isCompleted}
                        colunmId={columnId}
                        taskId={taskId}
                        subtaskId={sub._id}
                    />
                ))}
            </>
        );
    } else {
        return null;
    }
};

export default RenderSubTask;