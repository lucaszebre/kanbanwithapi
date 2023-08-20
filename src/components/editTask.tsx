// Import necessary hooks and components from React and your own libraries

import  { useContext, useState, useEffect } from "react";
import styles from "../styles/EditTask.module.css";
import { Opencontext } from "@/contexts/contextopen";
import { DataContext } from '@/contexts/datacontext';
// import { handleSave } from "@/utils/SaveEditTask";
import renderSelect from "@/utils/renderselect";
import { RenderSubTask } from "@/utils/renderSubTask";
import { useTheme } from '@/contexts/themecontext';
import supabase from "@/supabase";
import axios from "axios";
import { Subtasked } from "@/types";
// Main EditTask functional component

const EditTask = (props:{columnId:string,taskId:string,index:string}) => {

        // State hooks for managing subtasks and input errors

const { EditTask, setEditTask, setSubTasks } = useContext(Opencontext);
const [taskName, setTaskName] = useState<string>('');
const [taskDescription, setTaskDescription] = useState<string>('');
const [subTasked, setSubTasked] = useState<Subtasked[]>([]);
const [columnId, setColumnId] = useState<string>('');
const [save, setSave] = useState<boolean>(false);
const { currentTaskId,currentBoardIndex, boards, columns, openedTask, isMoving, SetIsMoving } = useContext(DataContext);
const [selectedColumnId, setSelectedColumnId] = useState(props.columnId);
const [columnErrors, setColumnErrors] = useState<boolean[]>([]);
const [inputError, setInputError] = useState<boolean>(false);
const { theme, setTheme } = useTheme();

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

useEffect(() => {
        if (openedTask) {
            setTaskName(openedTask.title);
            setTaskDescription(openedTask.description);
            setSubTasked(openedTask.subTask);
            setColumnId(openedTask.columnId);
        }
    }, [EditTask, openedTask]);

// function Add a subtask 
    const handleAddSubtask = () => {
        const newSubtask = {
            title: "",
            isCompleted: false,
        };
        setSubTasked([...subTasked, newSubtask]);
    };

// function to delete a subtask
    const handleDeleteSubtask = (index: number, subTaskId?: string) => {
        const updatedSubTasks = [...subTasked];
        updatedSubTasks.splice(index, 1);
        setSubTasked(updatedSubTasks);
    };



    const handleSubmit = async (e: React.FormEvent) => {  // function to handle the final form data 
        e.preventDefault();
        try{
            const { data: { user } } = await supabase.auth.getUser()
                    if (user) {
                        console.log(subTasked)
                    // User is authenticated, check if a row exists in the "User" table
                    const response = await axios.put(
                        `http://localhost:4000/user/${user.id}/boards/${boards[currentBoardIndex]._id}/columns/${props.columnId}/tasks/${currentTaskId}`,
                        {
                            title:taskName,
                            description:taskDescription,
                            subtask:subTasked
                        });
                        if(response.data){
                            console.log('Boards add')
                        }else{
                            console.error("Problem to add the boards")
                        }
                    }
        }catch(error){
            console.error('message',error)
        }
        SetIsMoving(!isMoving)
        };
    


    
 // Render the EditTask component
    return (
        <div className={styles.EditTaskWrapper}
        style={{
            display:EditTask?'flex':'none'
        }}
        onClick={async(e) => {
            if (e.target === e.currentTarget) {
                
                
            setEditTask(false);
            SetIsMoving(!isMoving)}
            }}
        
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
                
                <RenderSubTask subTasks={columns[props.index].tasks} handleEditSubTask={handleEditSubTask} handleDeleteSubtask={handleDeleteSubtask}  columnErrors={columnErrors}/>
        
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
                        {renderSelect (columns)}
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