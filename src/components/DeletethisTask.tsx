import styles from '../styles/DeleteThisTask.module.css';
import { useContext } from 'react';
import { DataContext } from '@/state/datacontext';
import { deleteTask } from '@/utils/deleteTask'; // import the function to delete the task in the firestore 
import { useTheme } from '@/state/themecontext';
import { useMutation,useQueryClient,useQuery } from 'react-query';
import {useStore}
 from '@/state/contextopen';
import { fetchBoards } from '@/utils/fetchBoard';
import React from 'react'

const DeleteThisTask = (props:{TaskTitle:string,TaskId:string,columnId:string}) => {
const { theme } = useTheme();
const {
    DeleteTaskBlock,
    setDeleteTaskBlock,
  } = useStore()
  
  const {data,isLoading,isError,error} = useQuery({
    queryKey:['boards'],
    queryFn:()=>fetchBoards(),
  });
  const {currentBoardIndex}=useStore()

const queryClient = useQueryClient()
    const mutation = useMutation(
        (formData: {boardId:string,columnId:string,taskId:string}) =>
        deleteTask(formData.taskId),
        {
        onSuccess: () => {
            queryClient.invalidateQueries(['boards']);
        },
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
                            mutation.mutate({boardId:data.boards[currentBoardIndex].id,columnId:props.columnId,taskId:props.TaskId})
                            setDeleteTaskBlock(false);
                        }}
                        className={styles.DeleteButton}
                    >
                        Delete
                    </button>
                    <button className={styles.CancelButton} onClick={() => setDeleteTaskBlock(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteThisTask;
