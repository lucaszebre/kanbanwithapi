import React from 'react';
import Subtasks from '@/components/subTask';
import { Subtask } from '@/types';
interface RenderSubTaskProps {
    subtasks: Subtask[];
}

const RenderSubTask: React.FC<RenderSubTaskProps> = ({ subtasks}) => {
    
    if (subtasks) {
        return (
            <>
                {subtasks.map((sub, index) => (
                    
                    <Subtasks
                        key={index}
                        title={sub.title}
                        checked={sub.isCompleted}
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