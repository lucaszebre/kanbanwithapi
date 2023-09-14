import React from 'react';
import TaskCard from './taskCard';
import styles from '../styles/ListTask.module.css';
import { Task ,ListTaskProps, Subtask} from '@/types';
import { DataContext } from '@/contexts/datacontext';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';

const ListTask: React.FC<ListTaskProps> = ({ tasks, title, NbList,columnId,columnIndex }) => {

    const { setOpenedTask,setCurrentColumnIndex,currentBoardIndex} = useContext(DataContext) // state to toggle the display of the  modalTask 
    const {data,isLoading,isError} = useQuery({
        queryKey:['boards'],
        queryFn:()=>fetchBoards(),
        });
    if (isLoading) {
        // Return loading skeletons
        return (
            <div className={styles.AppContainer}>
                <div className={styles.HeaderBoard}>
                    <Skeleton height={30} width={150} />
                </div>
                <div className={styles.BoardDiv}>
                    <div className={styles.SideContainer}>
                        <Skeleton height={500} width={70} />
                    </div>
                    <div className={styles.BoardWrapper}>
                        {/* Display multiple skeletons for columns */}
                        <div className={styles.AddColumn}>
                            <Skeleton height={30} width={100} />
                        </div>
                        {/* Repeat this skeleton for each column */}
                    </div>
                </div>
            </div>
        );
    }
    if(isError){
    return  <p>
        Something went wrongs
        </p>
    }

    const RenderTask = (): React.ReactNode[] => {  // functioon to render the all the tasks 
        return data.boards[currentBoardIndex].columns[columnIndex].tasks.map((task: { title: string; description: string; id: string; subtasks: Subtask[]; },index: number) => (
        <TaskCard
            key={index}
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
                setCurrentColumnIndex(columnIndex)
                }}
        />
        ));
    };

    return (
        <div className={styles.ListTaskDiv}>
        <div className={styles.ListTaskRow}>
            <div className={styles.CircleListTask}>.</div>
            <h1 className={styles.ListTaskTitle}>
            {title} ({tasks.length})
            </h1>
        </div>
        <div className={styles.ListTaskCols}>{RenderTask()}</div>
        </div>
    );
    };

export default ListTask;


