import styles from '@/styles/Deletethisboard.module.css';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import { DataContext } from '@/contexts/datacontext';
import { useTheme } from '@/contexts/themecontext';
import { useMutation,useQueryClient,useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import Skeleton from 'react-loading-skeleton';
import { axiosInstance } from '@/utils/instance';

const DeleteThisBoard = (props:{DeleteBlock:boolean,setDeleteBlock:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const { currentBoardId,setCurrentBoardId} = useContext(DataContext);  // state to manage the global data 
        const { theme, setTheme } = useTheme();
    const {data,isLoading,isError} = useQuery({
        queryKey:['boards'],
        queryFn:()=>fetchBoards(),
        });
    

    const queryClient = useQueryClient()
    const mutation = useMutation(
        ( boardId: string) =>
        deleteBoard(boardId),
        {
        onSuccess: () => {
            queryClient.invalidateQueries(['boards']);
        },
        }
    );

    
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
      const deleteBoard = async (boardId: string) => {  // function to delete the baord in the firestore 
        try {
                const response = await axiosInstance.delete(
                    `http://localhost:4000/boards/${boardId}`,
                    );
            
                    if (response.data) {
                    // Assuming the response data is an array of boards
                    console.log('The boards has been deleted');
                    } else {
                    console.error('Error fetching boards');
                    }
                    localStorage.setItem('currentBoardIndex', '0');
                    setCurrentBoardId(data.data.id)
            
        } catch (error) {
            console.error('Error while deleting the board:', error);
        }
    };
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
                        onClick={() => {
                            mutation.mutate(currentBoardId);
                            setCurrentBoardId(data.id);
                            props.setDeleteBlock(false);
                        }}
                        className={styles.DeleteButton}
                    >
                        Delete
                    </button>
                    <button className={styles.CancelButton} onClick={() => props.setDeleteBlock(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteThisBoard;

