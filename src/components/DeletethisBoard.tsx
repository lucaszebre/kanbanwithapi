import styles from '@/styles/Deletethisboard.module.css';
import { useTheme } from '@/state/themecontext';
import { useMutation,useQueryClient,useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';
import { useStore } from '@/state/contextopen';
import React from 'react'
import useDeleteBoardMutation from '@/utils/useDeleteBoardMutation';
const DeleteThisBoard = (props:{DeleteBlock:boolean,setDeleteBlock:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const { setCurrentBoardIndex} = useStore();  // state to manage the global data 
        const { theme } = useTheme();
        const {currentBoardIndex}=useStore()

    const {data,isLoading,isError,error} = useQuery({
        queryKey:['boards'],
        queryFn:()=>fetchBoards(),
        });
    

    const mutation = useDeleteBoardMutation(); // Use the custom hook here


    
    if (isLoading) {
        return (
            <div className={styles.DeleteThisBoardWrapper}>
                <div className={`${styles.DeletethisBoardDiv} ${theme === 'light' ? styles.light : styles.dark}`}>
                    <Skeleton height={30} width={150} style={{ marginBottom: '10px' }} />
                    <div style={{ marginBottom: '10px' }}>
                        <Skeleton height={20} width={250} style={{ marginBottom: '10px' }} />
                        <Skeleton height={20} width={250} />
                    </div>
                    <Skeleton height={20} width={300} style={{ marginBottom: '10px' }} />
                    <div className={styles.DeleteThisBoardButtons}>
                        <Skeleton height={40} width={100} style={{ marginRight: '10px' }} />
                        <Skeleton height={40} width={100} />
                    </div>
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
        <div className={styles.DeleteThisBoardWrapper} style={{ display: props.DeleteBlock ? 'flex' : 'none' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    props.setDeleteBlock(false);
                }}}>
            <div className={`${styles.DeletethisBoardDiv} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>
                <h1 className={styles.DeleteThisBoardTitle}>Delete this board?</h1>
                <p className={styles.DeleteThisBoardText}>
                    Are you sure you want to delete the ‘<a >
                        {/* {data.boards.find? data.boards[currentBoardIndex].name : ''} */}
                    </a>’ board? This action will remove all columns and tasks
                    and cannot be reversed.
                </p>
                <div className={styles.DeleteThisBoardButtons}>
                    <button
                        onClick={async () => {
                            try {
                                await mutation.mutateAsync(data.boards[currentBoardIndex]?.id);
                                if(data.boards){
                                    setCurrentBoardIndex(0)
                                }
                                
                            } catch (error) {
                                console.error('Error while deleting the board:', error);
                            }
                            props.setDeleteBlock(false);
                        }
                        
                    }
                        className={styles.DeleteButton}
                    >Delete</button>
                    <button className={styles.CancelButton} onClick={() => props.setDeleteBlock(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteThisBoard;

