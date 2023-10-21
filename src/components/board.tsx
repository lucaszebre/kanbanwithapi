/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from 'react';
import ListTask from './listTask';
import Sidebar from './sideBar';
import EmptyBoard from './emptyBoard';
import { useSidebarStore } from '@/state/sidebarcontext';
import Header from './header';
import styles from '../styles/Board.module.css';
import { getInitialWindowWidth } from '@/utils/GetInitialWidth';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard'; // Import updateBoard function
import { Task, Column } from '@/types';
import EditBoard from './editBoard/editBoard';
import {
    DragDropContext,
    DropResult,
} from 'react-beautiful-dnd';
import { changeColumn } from '@/utils/changeColumn';
import { useStore } from '@/state/contextopen';
import { useTaskManagerStore } from '@/state/taskManager';
import { randomUUID } from 'crypto';

const Board = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();
    const {currentBoardIndex}=useStore()
    const [windowWidth, setWindowWidth] = useState(getInitialWindowWidth());
    const [editBoard, setEditBoard] = useState(false);
    const queryClient = useQueryClient();
    const column = useMutation(
        (formData: {newColumnId:string,columnId:string,taskId:string}) =>
        changeColumn(formData.newColumnId,formData.columnId,formData.taskId),
        {
        onSuccess: () => {
            queryClient.refetchQueries(['boards','Task']);
        },
        }
    );
    useEffect(() => {

        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    useEffect(() => {
        if (windowWidth <= 767) {
            setIsSidebarOpen(false);
        }
    }, [windowWidth, setIsSidebarOpen]);

    const { data, isStale } = useQuery({
        queryKey: ['boards'],
        queryFn: () => fetchBoards()
        });

    const setTaskManagerData = useTaskManagerStore((state) => state.setTaskManagerData);

    const taskManager = useTaskManagerStore((state)=>state.taskManager)

    useEffect(() => {
        if ( data ) {
          setTaskManagerData(data);
        }
      }, [data,isStale, setTaskManagerData]);
    





    // Define the onDragEnd function
    const onDragEnd = (result: DropResult) => {
        // Check if the task was dropped into a different column
        if (!result.destination) {
          return;
        }
    
        // Find the source column based on the source droppableId
        const sourceColumnId = result.source.droppableId;
        const sourceColumn = taskManager[0].boards[currentBoardIndex].columns.find((column: { id: string; }) => column.id === sourceColumnId);
    
        // Check if the source column was found
        if (!sourceColumn) {
          return;
        }
    
        // Find the task that was dragged based on its index in the source column
        const draggedTask = sourceColumn.tasks[result.source.index].id;
    
        // Find the destination column's ID
        const destinationColumnId = result.destination.droppableId;
    
        // Call the changeColumn mutation to update the task's column
        column.mutate({
          newColumnId: destinationColumnId,
          columnId: sourceColumnId,
          taskId: draggedTask,
        });
    
        // Invalidate queries to trigger a refetch
        queryClient.refetchQueries(['boards', 'Task']);
      };

    // function to render data 
    function renderListTask() {
        if (
            taskManager[0].boards[currentBoardIndex].columns &&
            taskManager[0].boards[currentBoardIndex].columns.length > 0
        ) {
            return (
                <DragDropContext onDragEnd={onDragEnd}>
                    {taskManager[0].boards[currentBoardIndex].columns.map(
                        (column: Column, columnIndex: number) => (
                            <ListTask
                                key={columnIndex}
                                title={column.name}
                                tasks={column.tasks}
                                columnId={column.id}
                                columnIndex={columnIndex}
                                NbList={columnIndex}
                            />
                        )
                    )}
                </DragDropContext>
            );
        } else {
            return <EmptyBoard boards={true} />;
        }
    }


    if (taskManager && taskManager[0].boards[currentBoardIndex]) {
        return (
            <>
                <EditBoard editBoard={editBoard} setEditBoard={setEditBoard} />
                <div className={styles.AppContainer}>
                    <div className={styles.HeaderBoard}>
                        <Header boards={true} />
                    </div>
                    <div className={styles.BoardDiv}>
                        <div
                            className={styles.SideContainer}
                            style={{
                                display: isSidebarOpen ? 'block' : 'none',
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            <Sidebar boards={true} />
                        </div>
                        <div
                            className={styles.BoardWrapper}
                            tabIndex={0}
                            style={{
                                marginLeft: isSidebarOpen ? '-70px' : '0px',
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            {renderListTask()}
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className={styles.AppContainer}>
                    <div className={styles.HeaderBoard}>
                        <Header boards={false} />
                    </div>
                    <div className={styles.BoardDiv}>
                        <div
                            className={styles.SideContainer}
                            style={{
                                display: isSidebarOpen ? 'block' : 'none',
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            <Sidebar boards={false} />
                        </div>
                        <div
                            className={styles.BoardWrapper}
                            tabIndex={0}
                            style={{
                                marginLeft: isSidebarOpen ? '-70px' : '0px',
                                transition: 'all 0.3s ease-in-out',
                            }}
                        >
                            <EmptyBoard boards={false} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default Board;

