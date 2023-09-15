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
import { Subtasked } from "@/types";

const EditTask = (props:{columnId:string,taskId:string,index:number}) => {
    const { currentBoardIndex,currentColumnIndex,currentBoardId} = useContext(DataContext);

    const { data: task, isLoading, isError } = useQuery(
        ['Task', props.taskId], // Use these parameters as the query key
        () => getTask( props.taskId)
    );
    
        
    const {data} = useQuery({
        queryKey:['boards'],
        queryFn:()=>fetchBoards(),
      });   // State hooks for managing subtasks and input errors

const { EditTask, setEditTask } = useContext(Opencontext);
const [taskName, setTaskName] = useState<string>('');
const [taskDescription, setTaskDescription] = useState<string>('');
const [subTasked, setSubTasked] = useState<Subtasked[]>([]);
const [subTasktoDelete, setSubTasktoDelete] = useState<string[]>([]);
const [subTask, setSubTask] = useState<Subtask[]>([]);
const [subTasktoAdd, setSubTasktoAdd] = useState<string[]>([]);
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
        setSubTask(task.subtasks)
        setSubTasktoAdd([])
        setSubTasktoDelete([])
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


      
    
// Function to add a new subtask
const handleAddSubtask = () => {
    const newSubtask = {
        id: "", // You can generate a unique ID here if needed
        title: "",
        isCompleted: false,
        add:true
    };
    setSubTasked([...subTasked, newSubtask]);
  };
  

    
    // Function to edit/update a subtask
    const handleEditSubtask = (index:number, newTitle:string, subTaskId:string, add:boolean) => {
        // If 'add' is true, add the subtask to the 'subTasksToAdd' state
        
        // Update the subtask title
        const updatedSubTasks = [...subTasked];
        updatedSubTasks[index].title = newTitle;
        setSubTasked(updatedSubTasks);
    };
    


    // Function to delete a subtask
    const handleDeleteSubtask = (index:number, subtaskId:string) => {
        // If 'subTaskId' is provided, add it to the 'subTasksToDelete' state
        if (subtaskId) {
        setSubTasktoDelete([...subTasktoDelete, subtaskId]);
        }
    
        // Remove the subtask from the 'subTasks' state
        const updatedSubTasks = [...subTasked];
        updatedSubTasks.splice(index, 1);
        setSubTasked(updatedSubTasks);
    };



    const queryClient = useQueryClient()
    const mutation = useMutation(
        (formData: {taskId:string,taskName:string,taskDescription:string,subTasktoAdd:string[],subTasktoDelete:string[],subTask:Subtasked[]}) =>
        editTask(formData.taskId,formData.taskName,formData.taskDescription,formData.subTasktoAdd,formData.subTasktoDelete,formData.subTask),
        {
        onSuccess: () => {
            queryClient.invalidateQueries(['boards','Task']);
        },
        }
    );
        const column = useMutation(
            (formData: {newColumnId:string,columnId:string, boardId:string,taskId:string,newtask:Task }) =>
            changeColumn(formData.newColumnId,formData.columnId,formData.boardId,formData.taskId,formData.newtask),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['boards','Task']);
            },
            }
        );

    const handleSubmit = async (e: React.FormEvent) => {  // function to handle the final form data 
        e.preventDefault();
        if(data && data.boards[currentBoardIndex].id){
            mutation.mutate({taskId:props.taskId,taskName,taskDescription,subTasktoAdd:subTasked
                .filter((sub) => sub.add)
                .map((sub) => sub.title),subTasktoDelete,subTask})
            setSubTasktoAdd([])
            setSubTasktoDelete([])
        }
        if (selectedColumnId && selectedColumnId !== props.columnId) {
            console.log('columnId',props.columnId)
            column.mutate({newColumnId:selectedColumnId,columnId:data.boards[currentBoardIndex].columns[currentColumnIndex].id,boardId:currentBoardId,taskId:props.taskId,newtask:{
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
                
                <RenderSubTask subTasks={subTasked} handleDeleteSubtask={handleDeleteSubtask} handleEditSubTask={handleEditSubtask}  columnErrors={columnErrors}/>
        
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
                        {data && renderSelect (data.boards[currentBoardIndex].columns)}
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