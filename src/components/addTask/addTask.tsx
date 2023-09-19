import React, { useState, useEffect } from 'react';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import styles from '@/styles/AddTask.module.css';
import { DataContext } from '@/contexts/datacontext';
import renderSelect from '../../utils/renderselect';
import SubTask from './SubTask';
import { useTheme } from '@/contexts/themecontext';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { createTask } from '@/utils/createTask';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';

const AddTask = (props: {
  addTask: boolean;
  setAddTask: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['boards'],
    queryFn: () => fetchBoards(),
  });
  const [taskTitle, setTaskTitle] = useState(''); // state for the task title
  const [taskDescription, setTaskDescription] = useState(''); // state for task description
  const [SubTaskCurrent, setSubTaskCurrent] = useState<string[]>([]); // states to save up the name of all the subtasks I add
  const { currentBoardIndex, isMoving } = useContext(DataContext); // state to manage the global data
  const [SubTasksError, setSubTasksError] = useState<boolean[]>([]); // state to handle if one of the subtasks is empty
  const [taskTitleError, setTaskTitleError] = useState(false); // state to handle if the task title is empty
  const { theme, setTheme } = useTheme();
  const [SelectId, setSelectId] = useState(''); // state to know which column is selected
  useEffect(() => {
    if (data && data.boards[currentBoardIndex] && data.boards[currentBoardIndex].columns[0]) {
      setSelectId(data.boards[currentBoardIndex].columns[0].id);
    }
  }, [data, isMoving]);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (formData: { taskTitle: string; taskDescription: string; columnId: string; SubTaskCurrent: string[] }) =>
      createTask(formData.taskTitle, formData.taskDescription, formData.columnId, formData.SubTaskCurrent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['boards']);
      },
    }
  );
  function addSubTask() {
    setSubTaskCurrent([...SubTaskCurrent, '']);
  }
  const handleColumnTitleChange = (index: number, updatedTitle: string) => {
    const updatedColumns = [...SubTaskCurrent];
    updatedColumns[index] = updatedTitle;
    setSubTaskCurrent(updatedColumns);
    setTaskTitleError(false);
  };
  function handleSubTaskDelete(index: number) {
    const newSubTask = [...SubTaskCurrent];
    newSubTask.splice(index, 1);
    setSubTaskCurrent(newSubTask);
  };
  const HandleSubmit = async () => {
    if (taskTitle && taskDescription && SelectId) {
      mutation.mutate({ taskTitle, taskDescription, columnId: SelectId, SubTaskCurrent });
      setTaskTitle('');
      setTaskDescription('');
      setSubTaskCurrent([]);
    } else {
      console.log('Tasktitle', taskTitle);
      console.log('taskDescription', taskDescription);
      console.log('SelectId', SelectId);
      console.error("error in Add Task");
    }
  };
  if (isLoading) {
    return (
      <div className={styles.AddTaskWrapper} style={{ display: props.addTask ? 'flex' : 'none' }}>
        <div className={`${styles.AddTaskBlock} ${theme === 'light' ? styles.light : styles.dark}`}>
          <Skeleton height={30} width={200} style={{ marginBottom: '10px' }} />
          {/* Other skeleton components */}
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
  return (
    <div className={styles.AddTaskWrapper} style={{ display: props.addTask ? 'flex' : 'none' }}>
      <div className={`${styles.AddTaskBlock} ${theme === 'light' ? styles.light : styles.dark}`}>
        <h2 className={`${styles.AddTaskTitle} ${theme === 'light' ? styles.light : styles.dark}`}>Add Task</h2>
        <form
          className={styles.AddTaskForm}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!SubTaskCurrent || !taskTitle) {
              const newSubTaskErrors = SubTaskCurrent.map((subTask) => subTask.trim() === '');
              setSubTasksError(newSubTaskErrors);
              if (taskTitle.trim() === "") {
                setTaskTitleError(true);
              } else if (newSubTaskErrors.some(error => error)) {
                console.error('error in subtask ');
                return;
              }
            } else {
              await HandleSubmit();
              props.setAddTask(false);
            }
          }}
        >
          <label className={`${styles.AddTaskLabel} ${theme === 'light' ? styles.light : styles.dark}`} htmlFor="taskTitle">Task Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value)
              setTaskTitleError(false)
            }}
            className={`${styles.AddTaskInput} ${theme === 'light' ? styles.light : styles.dark} ${taskTitleError ? styles.error : ''}`}
          />
          {taskTitleError && <div className={styles.TaskTitleError}>Task name can not be empty </div>}
          <label className={`${styles.AddTaskLabel} ${theme === 'light' ? styles.light : styles.dark}`} htmlFor="taskDescription">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            cols={30}
            rows={10}
            className={`${styles.AddTaskTextArea} ${theme === 'light' ? styles.light : styles.dark}`}
          ></textarea>
          <label className={`${styles.AddTaskLabel} ${theme === 'light' ? styles.light : styles.dark}`} htmlFor="taskColumnSelect">Subtasks</label>
          <SubTask
            subTasks={SubTaskCurrent}
            handleSubTaskDelete={handleSubTaskDelete}
            handleColumnTitleChange={handleColumnTitleChange}
            columnErrors={SubTasksError}
          />
          <button className={styles.AddTaskSaveButton} style={{ marginBottom: '25px' }}
            onClick={(e) => {
              e.preventDefault();
              addSubTask();
            }}
          >
            + Add New Subtask
          </button>
          <select
            onChange={(e) => setSelectId(e.target.value)}
            value={SelectId}
            onClick={() => { console.log(SelectId) }}
            className={`${styles.SelectAddTask} ${theme === 'light' ? styles.light : styles.dark}`}
          >
            {renderSelect(data.boards[currentBoardIndex].columns)}
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


