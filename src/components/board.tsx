/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from 'react';
import ListTask from './listTask';
import Sidebar from './sideBar';
import EmptyBoard from './emptyBoard';
import { KanbanContext } from '@/contexts/sidebarcontext';
import Header from './header';
import styles from '../styles/Board.module.css';
import { DataContext } from '@/contexts/datacontext';
import { getInitialWindowWidth } from '@/utils/GetInitialWidth';
import { useTheme } from '@/contexts/themecontext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard'; // Import updateBoard function
import { Task, Column } from '@/types';
import Skeleton from 'react-loading-skeleton';
import EditBoard from './editBoard/editBoard';
import {
    DragDropContext,
    DropResult,
} from 'react-beautiful-dnd';
import { changeColumn } from '@/utils/changeColumn';
import { handleSessionExpiration } from '@/utils/handleSessionexpiration';

const Board = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useContext(KanbanContext);
    const { currentBoardIndex, Interval, setInterval,setIsLoggedIn } = useContext(DataContext);
    const [windowWidth, setWindowWidth] = useState(getInitialWindowWidth());
    const { theme } = useTheme();
    const [editBoard, setEditBoard] = useState(false);
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
    useEffect(() => {
        setInterval(1000);

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

    const { data, isLoading, error, isError } = useQuery({
        queryKey: ['boards'],
        queryFn: () => fetchBoards(),
        refetchInterval: Interval,
    });



    if (isLoading) {
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
                        <div className={styles.AddColumn}>
                            <Skeleton height={30} width={100} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return <p>Something went wrong.</p>;
    }
   


    // Define the onDragEnd function
    const onDragEnd = (result: DropResult) => {
        // Check if the task was dropped into a different column
        if (!result.destination) {
          return;
        }
    
        // Find the source column based on the source droppableId
        const sourceColumnId = result.source.droppableId;
        const sourceColumn = data.boards[currentBoardIndex].columns.find((column: { id: string; }) => column.id === sourceColumnId);
    
        // Check if the source column was found
        if (!sourceColumn) {
          return;
        }
    
        // Find the task that was dragged based on its index in the source column
        const draggedTask = sourceColumn.tasks[result.source.index];
    
        // Find the destination column's ID
        const destinationColumnId = result.destination.droppableId;
    
        // Call the changeColumn mutation to update the task's column
        column.mutate({
          newColumnId: destinationColumnId,
          columnId: sourceColumnId,
          newtask: draggedTask,
        });
    
        // Invalidate queries to trigger a refetch
        queryClient.invalidateQueries(['boards', 'Task']);
      };

    function renderListTask() {
        if (
            data.boards[currentBoardIndex].columns &&
            data.boards[currentBoardIndex].columns.length > 0
        ) {
            return (
                <DragDropContext onDragEnd={onDragEnd}>
                    {data.boards[currentBoardIndex].columns.map(
                        (column: Column, columnIndex: number) => (
                            <ListTask
                                key={column.id}
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

    if (data.boards[currentBoardIndex]) {
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

