/* eslint-disable react-hooks/rules-of-hooks */
import styles from '../styles/DeleteThisTask.module.css';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import { DataContext } from '@/contexts/datacontext';
import { deleteTask } from '@/utils/deleteTask'; // import the function to delete the task in the firestore 
import { useTheme } from '@/contexts/themecontext';
import { useMutation,useQueryClient,useQuery } from 'react-query';


const noBoard = () => {
const { theme } = useTheme();
const { NoBoards,setNoBoards,setAddBoard } = useContext(Opencontext); // state to toggle the display of the components 
const {currentBoardId} = useContext(DataContext);  // state to manage the global data 
const queryClient = useQueryClient()
    const mutation = useMutation(
        (formData: {boardId:string,columnId:string,taskId:string}) =>
        deleteTask(formData.boardId,formData.columnId,formData.taskId),
        {
        onSuccess: () => {
            queryClient.invalidateQueries(['boards']);
        },
        }
    );
    return (
        <div className={styles.DeleteThisTaskWrapper} style={{ display: NoBoards ? 'flex' : 'none' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setNoBoards(false);
                }}}>
            <div className={`${styles.DeletethisTaskDiv} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>
                <h1 className={styles.DeleteThisTaskTitle}>You have no baords</h1>
                <p className={styles.DeleteThisTaskText}>
                    You should add a boards ...
                </p>
                <div className={styles.DeleteThisTaskButtons}>
                    <button
                        onClick={() => {
                            setAddBoard(true);
                        }}
                        className={styles.DeleteButton}
                    >
                        Add a boards
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default noBoard;

  

  
  
  
  
  

