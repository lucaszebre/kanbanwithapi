import styles from '../styles/DeleteThisTask.module.css';
import { useTheme } from '@/state/themecontext';
import { useQueryClient,useQuery, useMutation } from 'react-query';
import {useStore}
 from '@/state/contextopen';
import { fetchBoards } from '@/utils/fetchBoard';
import React from 'react'
import { deleteTask } from '@/utils/deleteTask';
import { useToast } from "@/components/ui/use-toast"
import { useTaskManagerStore } from '@/state/taskManager';


const DeleteThisTask = (props:{TaskTitle:string,TaskId:string,columnId:string}) => {
const { theme } = useTheme();
const {
    DeleteTaskBlock,
    setDeleteTaskBlock,
  } = useStore()
  const { toast } = useToast()

  const taskManager = useTaskManagerStore((state)=>state.taskManager)
  const delTask = useTaskManagerStore((state)=>state.deleteTask)

  const {currentBoardIndex}=useStore()
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: {boardId:string,columnId:string,taskId:string}) =>
    deleteTask(formData.taskId),
    {
    onSuccess: () => {
        queryClient.refetchQueries(['boards']);
        toast({
            title: "Task delete sucessfully!",
            
          })
    },
    onError: ()=>{
        toast({
            title: "Error to delete the task!",
            
          })
    }
    }
);   
    return (
        <div className={styles.DeleteThisTaskWrapper} style={{ display: DeleteTaskBlock ? 'flex' : 'none' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setDeleteTaskBlock(false);
                }}}>
            <div className={`${styles.DeletethisTaskDiv} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>
                <h1 className={styles.DeleteThisTaskTitle}>Delete this task?</h1>
                <p className={styles.DeleteThisTaskText}>
                    Are you sure you want to delete the ‘<a style={{
                        color:'white'
                    }}>{props.TaskTitle}</a>’ Task? This action will remove this task and this subtasks 
                    and cannot be reversed.
                </p>
                <div className={styles.DeleteThisTaskButtons}>
                    <button
                        onClick={() => {
                            delTask(taskManager[0].boards[currentBoardIndex].id,props.columnId,props.TaskId)
                            mutation.mutate({boardId:taskManager[0].boards[currentBoardIndex].id,columnId:props.columnId,taskId:props.TaskId})
                            setDeleteTaskBlock(false);
                        }}
                        className={styles.DeleteButton}
                    >Delete</button>
                    <button className={styles.CancelButton} onClick={() => setDeleteTaskBlock(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteThisTask;
