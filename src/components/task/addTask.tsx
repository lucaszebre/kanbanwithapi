import { taskApiServices } from "@/api/task/task.service";
import { useTaskManagerStore } from "@/state/taskManager";
import { useTheme } from "@/state/themecontext";
import styles from "@/styles/AddTask.module.css";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import renderSelect from "../../utils/renderselect";
import SubTasks from "./subTasks";

const AddTask = (props: {
  addTask: boolean;
  setAddTask: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const taskManager = useTaskManagerStore((state) => state.taskManager);
  const addTask = useTaskManagerStore((state) => state.addTask);

  const [taskTitle, setTaskTitle] = useState(""); // state for the task title
  const [taskDescription, setTaskDescription] = useState(""); // state for task description
  const [SubTaskCurrent, setSubTaskCurrent] = useState<string[]>([]); // states to save up the name of all the subtasks I add
  const [SubTasksError, setSubTasksError] = useState<boolean[]>([]); // state to handle if one of the subtasks is empty
  const [taskTitleError, setTaskTitleError] = useState(false); // state to handle if the task title is empty
  const { theme } = useTheme();
  const [SelectId, setSelectId] = useState(""); // state to know which column is selected
  useEffect(() => {
    const index = parseInt(Cookies.get("currentBoardIndex") || "0");
    if (
      taskManager &&
      taskManager[0].boards[index] &&
      taskManager[0].boards[index].columns
    ) {
      setSelectId(taskManager[0].boards[index].columns[0].id);
      console.log(index);
    }
  }, [parseInt(Cookies.get("currentBoardIndex") || "0")]);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (formData: {
      taskTitle: string;
      taskDescription: string;
      columnId: string;
      SubTaskCurrent: string[];
    }) =>
      taskApiServices.createTask(
        formData.taskTitle,
        formData.taskDescription,
        formData.columnId,
        formData.SubTaskCurrent
      ),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["boards"]);
        toast.success("Task add sucessfully");
      },
      onError: () => {
        toast.error("Error to add a task");
      },
    }
  );
  function addSubTask() {
    setSubTaskCurrent([...SubTaskCurrent, ""]);
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
  }
  const HandleSubmit = async () => {
    if (taskTitle && taskDescription && SelectId) {
      addTask(
        taskManager[0].boards[parseInt(Cookies.get("currentBoardIndex") || "0")]
          .id,
        taskTitle,
        taskDescription,
        SelectId,
        SubTaskCurrent
      );
      mutation.mutate({
        taskTitle,
        taskDescription,
        columnId: SelectId,
        SubTaskCurrent,
      });
      setTaskTitle("");
      setTaskDescription("");
      setSubTaskCurrent([]);
    } else {
      console.error("error in Add Task");
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.currentTarget == e.target) {
          props.setAddTask(false);
        }
      }}
      className={styles.AddTaskWrapper}
      style={{ display: props.addTask ? "flex" : "none" }}
    >
      <div
        className={`${styles.AddTaskBlock} ${
          theme === "light" ? styles.light : styles.dark
        }`}
      >
        <h2
          className={`${styles.AddTaskTitle} ${
            theme === "light" ? styles.light : styles.dark
          }`}
        >
          Add Task
        </h2>
        <form
          className={styles.AddTaskForm}
          onSubmit={async (e) => {
            e.preventDefault();
            if (!SubTaskCurrent || !taskTitle) {
              const newSubTaskErrors = SubTaskCurrent.map(
                (subTask) => subTask.trim() === ""
              );
              setSubTasksError(newSubTaskErrors);
              if (taskTitle.trim() === "") {
                setTaskTitleError(true);
              } else if (newSubTaskErrors.some((error) => error)) {
                console.error("error in subtask ");
                return;
              }
            } else {
              await HandleSubmit();
              props.setAddTask(false);
            }
          }}
        >
          <label
            className={`${styles.AddTaskLabel} ${
              theme === "light" ? styles.light : styles.dark
            }`}
            htmlFor="taskTitle"
          >
            Task Title
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
              setTaskTitleError(false);
            }}
            className={`${styles.AddTaskInput} ${
              theme === "light" ? styles.light : styles.dark
            } ${taskTitleError ? styles.error : ""}`}
          />
          {taskTitleError && (
            <div className={styles.TaskTitleError}>
              Task name can not be empty{" "}
            </div>
          )}
          <label
            className={`${styles.AddTaskLabel} ${
              theme === "light" ? styles.light : styles.dark
            }`}
            htmlFor="taskDescription"
          >
            Task Description
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            cols={30}
            rows={10}
            className={`${styles.AddTaskTextArea} ${
              theme === "light" ? styles.light : styles.dark
            }`}
          ></textarea>
          <label
            className={`${styles.AddTaskLabel} ${
              theme === "light" ? styles.light : styles.dark
            }`}
            htmlFor="taskColumnSelect"
          >
            Subtasks
          </label>
          <SubTasks
            subTasks={SubTaskCurrent}
            handleSubTaskDelete={handleSubTaskDelete}
            handleColumnTitleChange={handleColumnTitleChange}
            columnErrors={SubTasksError}
          />
          <button
            className={styles.AddTaskSaveButton}
            style={{ marginBottom: "25px" }}
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
            onClick={() => {
              console.log(SelectId);
            }}
            className={`${styles.SelectAddTask} ${
              theme === "light" ? styles.light : styles.dark
            }`}
          >
            {taskManager[0].boards[
              parseInt(Cookies.get("currentBoardIndex") || "0")
            ] &&
              taskManager[0].boards[
                parseInt(Cookies.get("currentBoardIndex") || "0")
              ].columns &&
              renderSelect(
                taskManager[0].boards[
                  parseInt(Cookies.get("currentBoardIndex") || "0")
                ].columns
              )}
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
