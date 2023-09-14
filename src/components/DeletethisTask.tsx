import styles from '../styles/DeleteThisTask.module.css';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import { DataContext } from '@/contexts/datacontext';
import { deleteTask } from '@/utils/deleteTask'; // import the function to delete the task in the firestore 
import { useTheme } from '@/contexts/themecontext';
import { useMutation,useQueryClient,useQuery } from 'react-query';


const DeleteThisTask = (props:{TaskTitle:string,TaskId:string,columnId:string}) => {
const { theme } = useTheme();
const { DeleteTaskBlock, setDeleteTaskBlock } = useContext(Opencontext); // state to toggle the display of the components 
const {currentBoardId} = useContext(DataContext);  // state to manage the global data 
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
                            mutation.mutate({boardId:currentBoardId,columnId:props.columnId,taskId:props.TaskId})
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
