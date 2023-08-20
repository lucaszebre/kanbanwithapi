import React, { useState , useEffect } from 'react';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import styles from '@/styles/AddTask.module.css';
import { createTask } from '@/utils/createTask';
import { DataContext } from '@/contexts/datacontext';
import { ColumnData } from '@/types';
import renderSelect from '../../utils/renderselect';
import SubTask from './SubTask'
import { useTheme } from '@/contexts/themecontext';
import supabase from '@/supabase';
import axios from 'axios';

const AddTask = () => {
    
    const { AddTask, setAddTask } = useContext(Opencontext)  // the state to tooggle the display of addtask
    const [taskTitle, setTaskTitle] = useState(''); // state for the tasktitle
    const [taskDescription, setTaskDescription] = useState(''); // state for task description 
    const [Select, setSelect] = useState<ColumnData[] | null>([]);  // state to render the select with the column names 
    const [SelectId, setSelectId] = useState('');  // state to know wich column is select 
    const [SubTaskCurrent,setSubTaskCurrent] = useState<string[]>([]) // states to save up the name of all the subtasks i add
    const { setBoards,SetIsMoving,isMoving,columns,currentBoardIndex,boards } = useContext(DataContext); // state to manage the global data 
    const [SubTasksError, setSubTasksError] = useState<boolean[]>([]);  // state to handle if one the subtask is empty 
    const [taskTitleError, setTaskTitleError] = useState(false);  // state to handle if the task title is empty 
    const { theme, setTheme } = useTheme();

    

        useEffect(() => {  // everytime the data is changing we actualize the ArrayColumn 
            const ArrayColumn = columns.map((column) => {
                return {
                    id: column._id,
                    name: column.name,
                }
            });
            setSelect(ArrayColumn as ColumnData[]);
            setSubTaskCurrent([])
        }, [isMoving,columns]);    

        function createSubTaskArray(SubTaskCurrent:string[]) {
            const SubtaskArray = [];
          
            for (const columnName of SubTaskCurrent) {
              const subtask = {
                title: columnName,
                isCompleted: false
              };
              SubtaskArray.push(subtask);
            }
          
            return SubtaskArray;
          }

        const HandleSubmit = async () => {  // function to handle the final data from the data 
        
            if (taskTitle && taskDescription && SelectId) {
                
                try{
                    const { data: { user } } = await supabase.auth.getUser()
                            if (user) {
                                console.log("user.id:", user.id);
                                console.log("currentBoardId:", boards[currentBoardIndex]._id);
                                console.log("SelectId:", SelectId);
                            // User is authenticated, check if a row exists in the "User" table
                            const response = await axios.post(`http://localhost:4000/user/${user.id}/boards/${boards[currentBoardIndex]._id}/columns/${SelectId}`,
                                {
                                    title:taskTitle,
                                    description:taskDescription,
                                    subtasks:createSubTaskArray(SubTaskCurrent)
                                });
                                if(response.data){
                                    console.log('Task add')
                                }else{
                                    console.error("Problem to task the boards")
                                }
                            }
                }catch(error){
                    console.error('message',error)
                }
                SetIsMoving(!isMoving)
                setTaskTitle('');
                setTaskDescription('');
                setSelectId('');
                
            }
            
            
        
        };



    function addSubTask() {  
        setSubTaskCurrent([...SubTaskCurrent,'']);
    }

    const handleColumnTitleChange = (index: number, updatedTitle: string) => {
        const updatedColumns = [...SubTaskCurrent];
        updatedColumns[index] = updatedTitle
        setSubTaskCurrent(updatedColumns);
        setTaskTitleError(false)
    };

    function handleSubTaskDelete(index: number) {
        const newSubTask = [...SubTaskCurrent];
        newSubTask.splice(index, 1);
        setSubTaskCurrent(newSubTask);
    }


    return (
    <div className={styles.AddTaskWrapper}
        style={{ display: AddTask ? 'flex' : 'none' }}
            onClick={
            (e) => {
                if (e.target === e.currentTarget) {
                    setAddTask(false)
                }
            }
        }
        >
        <div  className={`${styles.AddTaskBlock} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>
            <h2 className={`${styles.AddTaskTitle} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>Add Task</h2>
                <form className={styles.AddTaskForm} 
                onSubmit={async(e)=>{
                    e.preventDefault();
                    if(!SubTaskCurrent || !taskTitle){
                        const newSubTaskErrors = SubTaskCurrent.map(
                            (subTask) => subTask.trim() === ''
                        );
                        setSubTasksError(newSubTaskErrors)
                        if(taskTitle.trim()===""){
                            setTaskTitleError(true);
                        }else if(newSubTaskErrors.some(error => error)){                            
                            return;
                        }
                    }else{
                        await HandleSubmit();
                        SetIsMoving(!isMoving)
                        setAddTask(false)
                    }
                    
                }}
                >
                    <label className={`${styles.AddTaskLabel} ${
                theme === 'light' ? styles.light : styles.dark
                }`} htmlFor="taskTitle">Task Title</label>
                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) =>{ 
                            setTaskTitle(e.target.value)
                            setTaskTitleError(false)
                        }}
                        className={`${styles.AddTaskInput} ${
                            theme === 'light' ? styles.light : styles.dark
                            } ${taskTitleError ? styles.error : ''}`}
                    />
                    {taskTitleError && <div className={styles.TaskTitleError}>Task name can not be empty </div>}
                    <label className={`${styles.AddTaskLabel} ${
                theme === 'light' ? styles.light : styles.dark
                }`} htmlFor="taskDescription">Task Description</label>
                    <textarea 
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        cols={30}
                        rows={10}
                        className={`${styles.AddTaskTextArea} ${
                            theme === 'light' ? styles.light : styles.dark
                            }`}
                    >

                    </textarea>
                    <label className={`${styles.AddTaskLabel} ${
                theme === 'light' ? styles.light : styles.dark
                }`}  htmlFor="taskColumnSelect">Subtasks</label>
                    <SubTask
                    subTasks={SubTaskCurrent}
                    handleSubTaskDelete={handleSubTaskDelete}
                    handleColumnTitleChange={handleColumnTitleChange}
                    isMoving={isMoving}
                    columnErrors={SubTasksError}
                    />                    
                    <button className={styles.AddTaskSaveButton}  
                    style={{marginBottom: '25px'}}
                    onClick={(e) => {
                        e.preventDefault(); 
                        addSubTask();
                    }}
                    >
                        + AddNew Subtask
                    </button>
                    <select
                        onChange={(e) => setSelectId(e.target.value)}
                        className={`${styles.SelectAddTask} ${
                            theme === 'light' ? styles.light : styles.dark
                            }`} 
                    >
                        {renderSelect(columns)}
                    </select>

                    <button className={styles.AddTaskSaveButton} type="submit">
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
};


export default AddTask;
