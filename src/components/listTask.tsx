import React from 'react';
import TaskCard from './taskCard';
import styles from '../styles/ListTask.module.css';
import { ListTaskProps, Subtask } from '@/types';
import { DataContext } from '@/contexts/datacontext';
import { useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd'; // Import Draggable and Droppable
import Skeleton from 'react-loading-skeleton';

const ListTask: React.FC<ListTaskProps> = ({ tasks, title, NbList, columnId, columnIndex }) => {
    const { setOpenedTask, setCurrentColumnIndex, currentBoardIndex } = useContext(DataContext);

    const RenderTask = (): React.ReactNode[] => {
        return tasks.map((task: { title: string; description: string; id: string; subtasks: Subtask[] }, index: number) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <TaskCard
                            title={task.title}
                            description={task.description}
                            id={task.id}
                            columnId={columnId}
                            subtask={task.subtasks}
                            index={index}
                            columnIndex={columnIndex}
                            onClick={() => {
                                setOpenedTask({
                                    id: task.id,
                                    title: task.title,
                                    description: task.description,
                                    columnId: columnId,
                                    subTask: task.subtasks,
                                });
                                setCurrentColumnIndex(columnIndex);
                            }}
                        />
                    </div>
                )}
            </Draggable>
        ));
    };

    return (
        <Droppable droppableId={columnId} type="TASK">
            {(provided) => (
                <div
                    className={styles.ListTaskDiv}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className={styles.ListTaskRow}>
                        <div className={styles.CircleListTask}>.</div>
                        <h1 className={styles.ListTaskTitle}>
                            {title} ({tasks.length})
                        </h1>
                    </div>
                    <div className={styles.ListTaskCols}>
                        {RenderTask()}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

export default ListTask;



