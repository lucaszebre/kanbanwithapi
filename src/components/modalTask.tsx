
import React, { useContext } from 'react';
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
const ModalTask = (props:{
    _id: string;
    title: string;
    description: string;
    columnId: string;
    subTask : Subtask[]
    index:number
}) => {
    const { setCurrentBoardId,currentBoardId,currentBoardIndex,currentTaskId,ColId,setColId,setOpenedTask,SetIsMoving,isMoving } = useContext(DataContext);

    const { data: task, isLoading, isError } = useQuery(
        ['Task',currentBoardId , props.columnId, props._id], // Use these parameters as the query key
        () => getTask(currentBoardId, props.columnId,props._id)
    );

    const {data} = useQuery({
        queryKey:['Boards'],
        queryFn:()=>fetchBoards(),
      });
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
        if(data.Boards[currentBoardIndex].columns[0]){
            setColId(data.Boards[currentBoardIndex].columns[0]._id)
            setCurrentBoardId(data.Boards[currentBoardIndex]._id)
        }
    },[currentBoardIndex])

    React.useEffect(() => {  // when the column id change we change also the selectedColumnid 
        setSelectedColumnId(props.columnId);
    }, [props.columnId]);

    const queryClient = useQueryClient()
        const column = useMutation(
            (formData: {newColumnId:string,columnId:string, boardId:string,taskId:string,newtask:Task }) =>
            changeColumn(formData.newColumnId,formData.columnId,formData.boardId,formData.taskId,formData.newtask),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['Boards','Task']);
            },
            }
        );
            
  function Iscompleted(){  // function to get the amout of subtask completed 
    var i:number=0;
    if (task && task.subtasks){
        for(const sub of task.subtasks){
        if( sub.isCompleted){
            i++
        }}}
    return i }
        if(isLoading){
            return <p>Loading...</p>
        }
        if(isError){
            return <p>
            Something went wrongs
            </p>
        }   
    return (
        <>
        <EditTask columnId={props.columnId} taskId={props._id} index={props.index}  />
        <DeleteThisTask columnId={ColId} TaskTitle={props.title}  TaskId={props._id} />
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
                        column.mutate({newColumnId:selectedColumnId,columnId:props.columnId,boardId:currentBoardId,taskId:props._id,newtask:{
                            title: props.title,
                            description: props.description,
                            subtasks: []
                        }});
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
                    <h2 className={styles.ModalTaskH2}>Subtasks ({Iscompleted()} of {props.subTask.length})</h2>
                    <RenderSubTask 
                        subtasks={props.subTask} 
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
                        {renderSelect(data.Boards[currentBoardIndex].columns)}
                    </select>
                </div>
            </div>
        </>
    );
};

export default ModalTask;
