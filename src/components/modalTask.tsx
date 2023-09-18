
import React, { useContext, useEffect, useState } from 'react';
import styles from '../styles/ModalTask.module.css';
import Image from 'next/image';
import { Opencontext } from '@/contexts/contextopen';
import { Subtask } from '@/types';
import { DataContext } from '@/contexts/datacontext';
import ModalAboutTask from './modalAboutTask';
import DeleteThisTask from './DeletethisTask';
import EditTask from './editTask';
import { changeColumn,Task } from '@/utils/changeColumn';
import renderSelect from '@/utils/renderselect';
import RenderSubTask from '@/utils/renderSubTaskModal';
import { useTheme } from '@/contexts/themecontext';
import { useMutation,useQueryClient,useQuery } from 'react-query';
import { getTask } from '@/utils/getTask';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';
import { handleSessionExpiration } from '@/utils/handleSessionexpiration';

const ModalTask = (props:{
    id: string;
    title: string;
    description: string;
    columnId: string;
    subTask : Subtask[]
    index:number
    numberSub:number
}) => {
    const {isCompleted, setCurrentBoardId,currentBoardId,currentBoardIndex,currentTaskId,ColId,setColId,setOpenedTask,SetIsMoving,isMoving,setInterval,setIsLoggedIn } = useContext(DataContext);
    const [subtask,setSubtask] = useState(props.subTask)
    const { data: task, isLoading, isError } = useQuery(
        ['Task', props.id], // Use these parameters as the query key
        () => getTask( props.id)
    );
    if ( task === undefined) {
        // If there's an error or data is undefined, display the custom error page
        
      }else{
        setIsLoggedIn(true)
      }
    const {data,error} = useQuery({
        queryKey:['boards'],
        queryFn:()=>fetchBoards(),
      });
      if ( data === undefined) {
        // If there's an error or data is undefined, display the custom error page
        
      }else{
        setIsLoggedIn(true)
      }
    // state 
    const { SubTasks, setSubTasks } = useContext(Opencontext); // state to toggle the display of Subtasks
    const [openModalAbout, setOpenModalAbout] = React.useState(false);// state to toggle th displat of the ModalAbout

    // state to manage the global Data 
    // state to know wich column id we are currently 
    const [selectedColumnId, setSelectedColumnId] = React.useState(props.columnId);

    const { theme, setTheme } = useTheme();

    React.useEffect(()=>{ // every mount we need to display none the ModalAbout 
        setOpenModalAbout(false)
    },[])

    React.useEffect(()=>{  // when the current board id change we set defaultly the col id to the first column 
        if(data.boards[currentBoardIndex].columns[0]){
            setColId(data.boards[currentBoardIndex].columns[0].id)
            setCurrentBoardId(data.boards[currentBoardIndex].id)
        }
    },[currentBoardIndex])

    React.useEffect(() => {  // when the column id change we change also the selectedColumnid 
        setSelectedColumnId(props.columnId);
    }, [props.columnId]);

    const queryClient = useQueryClient()
        const column = useMutation(
            (formData: {newColumnId:string,columnId:string,newtask:Task }) =>
            changeColumn(formData.newColumnId,formData.columnId,formData.newtask),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['boards','Task']);
            },
            }
        );
            
        function Iscompleted(){  // function to get the amout of subtask completed 
            var i:number=0;
            console.log(task)
            if (task){
                for(const sub of task.subtasks){
                if( sub.isCompleted){
                    i++
                }}}
            return i }
    if (isLoading) {
        // Return loading skeletons
        return (
            <>
                <Skeleton height={30} width={300} />
                <Skeleton height={20} width={200} />
                {/* Display multiple skeletons for subtasks */}
                {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} height={15} width={150} style={{ marginTop: '10px' }} />
                ))}
                <Skeleton height={20} width={150} style={{ marginTop: '20px' }} />
                {/* Display skeleton for select */}
                <Skeleton height={30} width={150} style={{ marginTop: '10px' }} />
            </>
        );
    }

    if (isError) {
        return (
            <p>
                Something went wrong
            </p>
        );
    } 
    return (
        <>
        <EditTask columnId={props.columnId} taskId={props.id} index={props.index}  />
        <DeleteThisTask columnId={ColId} TaskTitle={props.title}  TaskId={props.id} />
            <div
                className={styles.ModalTaskWrapper}
                style={{
                    display: SubTasks ? 'flex' : 'none',
                }}
                onClick={async (e) => {
                console.log(selectedColumnId,props.columnId)
                if (e.target === e.currentTarget) {
                    setOpenedTask(null);
                    if (selectedColumnId && selectedColumnId !== props.columnId) {
                        column.mutate({newColumnId:selectedColumnId,columnId:props.columnId,newtask:{
                            id:props.id,
                            status:"to do",
                            title: props.title,
                            description: props.description,
                            subtasks: subtask
                        }});
                        setInterval(1)
                    SetIsMoving(prevIsmoving => !prevIsmoving)
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
                        <h1>{props.title}</h1>
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
                        {props.description}
                    </p>
                    <h2 className={styles.ModalTaskH2}>Subtasks ({isCompleted} of {subtask.length})</h2>
                    <RenderSubTask 
                        subtasks={subtask} 
                        currentBoardId={currentBoardId}
                        columnId={props.columnId}
                        taskId={currentTaskId}
                        setIsMoving={SetIsMoving}
                        isMoving={isMoving}
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
                        {renderSelect(data.boards[currentBoardIndex].columns)}
                    </select>
                </div>
            </div>
        </>
    );
};

export default ModalTask;
