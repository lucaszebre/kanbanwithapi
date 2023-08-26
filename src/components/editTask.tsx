// Import necessary hooks and components from React and your own libraries
import  { useContext, useState, useEffect } from "react";
import styles from "../styles/EditTask.module.css";
import { Opencontext } from "@/contexts/contextopen";
import { DataContext } from '@/contexts/datacontext';
import renderSelect from "@/utils/renderselect";
import { RenderSubTask } from "@/utils/renderSubTask";
import { useTheme } from '@/contexts/themecontext';
import { Subtask } from "@/types/Zodtype";
import { fetchBoards } from "@/utils/fetchBoard";
// Main EditTask functional component
import { useMutation,useQueryClient,useQuery } from 'react-query';
import { editTask } from "@/utils/editTask";
import { getTask } from "@/utils/getTask";
import { Task, changeColumn } from "@/utils/changeColumn";
import Skeleton from "react-loading-skeleton";

const EditTask = (props:{columnId:string,taskId:string,index:number}) => {
    const { currentBoardIndex,currentColumnIndex,currentBoardId} = useContext(DataContext);

    const { data: task, isLoading, isError } = useQuery(
        ['Task',currentBoardId , props.columnId, props.taskId], // Use these parameters as the query key
        () => getTask(currentBoardId, props.columnId, props.taskId)
    );
    
        
    const {data} = useQuery({
        queryKey:['Boards'],
        queryFn:()=>fetchBoards(),
      });   // State hooks for managing subtasks and input errors

const { EditTask, setEditTask, setSubTasks } = useContext(Opencontext);
const [taskName, setTaskName] = useState<string>('');
const [taskDescription, setTaskDescription] = useState<string>('');
const [subTasked, setSubTasked] = useState<Subtask[]>([]);
const [save, setSave] = useState<boolean>(false);
const [selectedColumnId, setSelectedColumnId] = useState(props.columnId);
const [columnErrors, setColumnErrors] = useState<boolean[]>([]);
const [inputError, setInputError] = useState<boolean>(false);
const { theme, setTheme } = useTheme();

useEffect(()=>{
    if(task){
        setTaskName(task.title)
        setTaskDescription(task.description)
        setSubTasked(task.subtasks)
    }
},[task])

// Set the selected column ID whenever the prop changes
useEffect(() => {
    setSelectedColumnId(props.columnId);
}, [props.columnId]);

// Set initial column errors based on subtasks

useEffect(() => {
    const initialColumnErrors = subTasked.map((column) => column.title.trim() === "");
    setColumnErrors(initialColumnErrors);
}, [EditTask]);


// Update task states when EditTask or openedTask changes


      
    
// function Add a subtask 
    const handleAddSubtask = () => {
        const newSubtask = {
            _id:"",
            title: "",
            isCompleted: false,
        };
        setSubTasked([...subTasked, newSubtask]);
    };
    const handleEditSubTask = (index: number, newTitle: string, subTaskId?: string, add?: boolean) => {
        const updatedSubTasks = [...subTasked];
        updatedSubTasks[index].title = newTitle;
        
        setSubTasked(updatedSubTasks);
    }
// function to delete a subtask
    const handleDeleteSubtask = (index: number, subTaskId?: string) => {
        const updatedSubTasks = [...subTasked];
        updatedSubTasks.splice(index, 1);
        setSubTasked(updatedSubTasks);
    };

    const queryClient = useQueryClient()
    const mutation = useMutation(
        (formData: {boardId:string,columnId:string,taskId:string,taskName:string,taskDescription:string,subTasked:Subtask[] }) =>
        editTask(formData.boardId, formData.columnId,formData.taskId,formData.taskName,formData.taskDescription,formData.subTasked),
        {
        onSuccess: () => {
            queryClient.invalidateQueries(['Boards','Task']);
        },
        }
    );
        const column = useMutation(
            (formData: {newColumnId:string,columnId:string, boardId:string,taskId:string,newtask:Task }) =>
            changeColumn(formData.newColumnId,formData.columnId,formData.boardId,formData.taskId,formData.newtask),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['Boards','Task']);
            },
            }
        );

    const handleSubmit = async (e: React.FormEvent) => {  // function to handle the final form data 
        e.preventDefault();
        if(data && data.Boards[currentBoardIndex]._id){
            mutation.mutate({boardId:data.Boards[currentBoardIndex]._id,columnId:data.Boards[currentBoardIndex].columns[currentColumnIndex]._id,taskId:data.Boards[currentBoardIndex].columns[currentColumnIndex].tasks[props.index]._id,taskName,taskDescription,subTasked})
        }
        if (selectedColumnId && selectedColumnId !== props.columnId) {
            console.log('columnId',props.columnId)
            column.mutate({newColumnId:selectedColumnId,columnId:data.Boards[currentBoardIndex].columns[currentColumnIndex]._id,boardId:currentBoardId,taskId:props.taskId,newtask:{
                title: taskName,
                description: taskDescription,
                subtasks: subTasked
            }});
            }}        


            if (isLoading) {
                return (
                    <div className={styles.EditTaskWrapper}>
                        <div className={`${styles.EditTaskBlock} ${theme === 'light' ? styles.light : styles.dark}`}>
                            <Skeleton height={30} width={150} style={{ marginBottom: '10px' }} />
                            <Skeleton height={20} width={200} style={{ marginBottom: '10px' }} />
                            <div style={{ marginBottom: '10px' }}>
                                <Skeleton height={20} width={100} style={{ marginRight: '10px' }} />
                                <Skeleton height={20} width={100} />
                            </div>
                            <Skeleton height={30} width={100} style={{ marginBottom: '10px' }} />
                            <Skeleton height={20} width={150} style={{ marginBottom: '10px' }} />
                            <div style={{ marginBottom: '10px' }}>
                                <Skeleton height={20} width={150} style={{ marginRight: '10px' }} />
                                <Skeleton height={20} width={150} />
                            </div>
                            <Skeleton height={20} width={100} style={{ marginBottom: '10px' }} />
                            <Skeleton height={30} width={100} style={{ marginBottom: '10px' }} />
                        </div>
                    </div>
                );
            }
        
            if (isError) {
                return (
                    <p>
                        Something went wrong
                    </p>
                );
            }

            
 // Render the EditTask component
    return (
        <div className={styles.EditTaskWrapper}
        style={{
            display:EditTask?'flex':'none'
        }}
        onClick={async(e) => {
            if (e.target === e.currentTarget) {
            setEditTask(false);
            }}}
        
        >
            <div 
            className={`${styles.EditTaskBlock} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>
            <h3 className={`${styles.EditTaskHeader} ${
                theme === 'light' ? styles.light : styles.dark
            }`}>Edit Task</h3>
            <form className={styles.EditTaskForm}  onSubmit={async(e)=>{
                    e.preventDefault();
                    const newColumnErrors = subTasked.map((sub) => sub.title.trim() === "");
                    setColumnErrors(newColumnErrors);
                    if(taskName.trim()===''){
                        setInputError(true)
                    }else if (newColumnErrors.some((error) => error)){
                        return ;
                    }else{
                        handleSubmit(e);
                        setSave(!save);
                        setEditTask(false);
                    }
                    
                }}>
            <label className={`${styles.EditTaskLabel} ${
                theme === 'light' ? styles.light : styles.dark
            }`} htmlFor="boardName">
                Task name
            </label>
                <input
                    type="text"
                    className={`${styles.EditTaskInputHeader} ${
                        theme === 'light' ? styles.light : styles.dark
                    } ${inputError ? styles.InputError : ''}`}
                    value={taskName}
                    onChange={(e) =>{
                        setTaskName(e.target.value)
                        setInputError(false)
                    }}
                />
                {inputError && <div className={styles.ErrorMessage}>Please enter a Task name.</div>}

                <label className={`${styles.EditTaskLabel} ${
                theme === 'light' ? styles.light : styles.dark
            }`} htmlFor="boardName">
                Description
                </label>
                <textarea
                className={`${styles.EditTaskTextArea} ${
                    theme === 'light' ? styles.light : styles.dark
                }`}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                ></textarea>
                <label className={`${styles.EditTaskLabel} ${
                theme === 'light' ? styles.light : styles.dark
            }`} htmlFor="boardName">
                SubTasks
                </label>
                
                <RenderSubTask subTasks={subTasked} handleEditSubTask={handleEditSubTask} handleDeleteSubtask={handleDeleteSubtask}  columnErrors={columnErrors}/>
        
                <button className={styles.EditTaskAddButton} type='button' onClick={handleAddSubtask}>Add Subtask</button>
                <label className={`${styles.EditTaskLabel} ${
                theme === 'light' ? styles.light : styles.dark
            }`}  htmlFor="">Current Status</label>

                <select
                        value={selectedColumnId}
                        onChange={(e) => {
                            setSelectedColumnId(e.target.value);
                        }}
                        className={`${styles.SelectState} ${
                            theme === 'light' ? styles.light : styles.dark
                        }`}
                    >
                        {data && renderSelect (data.Boards[currentBoardIndex].columns)}
                    </select>
            <button className={styles.EditTaskSaveButton}  
            type='submit'
                >Save Changes</button>
            </form>
        </div>
    </div>

    );
};
export default EditTask;