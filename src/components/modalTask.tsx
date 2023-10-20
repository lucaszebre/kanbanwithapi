import React, { useContext, useEffect, useState } from 'react';
import styles from '../styles/ModalTask.module.css';
import Image from 'next/image';
import { DataContext } from '@/state/datacontext';
import ModalAboutTask from './modalAboutTask';
import DeleteThisTask from './DeletethisTask';
import EditTask from './editTask';
import { changeColumn,Task } from '@/utils/changeColumn';
import renderSelect from '@/utils/renderselect';
import RenderSubTask from '@/utils/renderSubTaskModal';
import { useTheme } from '@/state/themecontext';
import { useMutation,useQueryClient,useQuery } from 'react-query';
import {useStore}
 from '@/state/contextopen';
import { useTaskManagerStore } from '@/state/taskManager';

const ModalTask = (props:{
    id: string;
    columnId: string;
    index:number;
}) => {
    const {currentBoardIndex,completed} = useStore()
    const {setOpenedTask,setIsLoggedIn } = useContext(DataContext);
  
    const taskManager = useTaskManagerStore((state)=>state.taskManager)
    
    const task =  taskManager[0].boards[currentBoardIndex].columns.find((col)=>col.id === props.columnId)?.tasks.find((task)=>task.id==props.id)

    // state 
    const {
        SubTasks,
        setSubTasks,
      } = useStore()
    const [openModalAbout, setOpenModalAbout] = React.useState(false);// state to toggle th displat of the ModalAbout

    // state to manage the global Data 
    // state to know wich column id we are currently 
    const [selectedColumnId, setSelectedColumnId] = React.useState(props.columnId);

    const { theme } = useTheme();

    useEffect(()=>{ // every mount we need to display none the ModalAbout 
        setOpenModalAbout(false)
        
    },[])
  
    
    useEffect(() => {  // when the column id change we change also the selectedColumnid 
        setSelectedColumnId(props.columnId);
    }, [props.columnId]);

    const queryClient = useQueryClient()
        const column = useMutation(
            (formData: {newColumnId:string,columnId:string,taskId:string }) =>
            changeColumn(formData.newColumnId,formData.columnId,formData.taskId),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['boards','Task']);
            },
            }
        );
            
    if(task){
        return (
            <>
            <EditTask columnId={props.columnId} taskId={props.id} index={props.index}  />
            <DeleteThisTask columnId={props.columnId} TaskTitle={task.title}  TaskId={props.id} />
                <div
                    className={styles.ModalTaskWrapper}
                    style={{
                        display: SubTasks ? 'flex' : 'none',
                    }}
                    onClick={async (e) => {
                    if (e.target === e.currentTarget) {
                        setOpenedTask(null);
                        setSubTasks(false)
                        if (selectedColumnId && selectedColumnId !== props.columnId) {
                            column.mutate({newColumnId:selectedColumnId,columnId:props.columnId,taskId:props.id
                                });
                            queryClient.invalidateQueries(['boards']);
                        }}}}>
                
                    <div 
                    className={`${styles.ModalTaskDiv} ${
                        theme === 'light' ? styles.light : styles.dark
                        }`}
                    >
    
                    <ModalAboutTask
                    visible={openModalAbout}
                    />
                        <div 
                        className={`${styles.ModalTaskHeader} ${
                            theme === 'light' ? styles.light : styles.dark
                            }`}
                        >
                            <h1>{task.title}</h1>
                            <Image
                                onClick={() => {
                                    setOpenModalAbout(!openModalAbout);
                                }}
                                className={styles.ModalTaskEllipsis}
                                src="/assets/icon-vertical-ellipsis.svg"
                                alt="vertical-ellipsis"
                                width={4.62}
                                height={20}/>
                        </div>
                        <p className={styles.TaskDescription}>
                            {task.description}
                        </p>
                        <h2 className={styles.ModalTaskH2}>Subtasks     </h2>
                        <RenderSubTask 
                            boardId={taskManager[0].boards[currentBoardIndex].id}
                            columnId={props.columnId}
                            subtasks={task.subtasks} 
                            />
                        <h2 className={`${styles.ModalTaskH2} ${
                            theme === 'light' ? styles.light : styles.dark
                            }`}
                        >Current Status</h2>
                        <select
                            value={selectedColumnId}
                            onChange={(e) => {
                                setSelectedColumnId(e.target.value);
                            }}
                            className={`${styles.SelectState} ${
                                theme === 'light' ? styles.light : styles.dark
                                }`}
                        >
                            {renderSelect(taskManager[0].boards[currentBoardIndex].columns)}
                        </select>
                    </div>
                </div>
            </>
        );
    }else{
        return (
            <>
            </>
        )
    }
    
};

export default ModalTask;
