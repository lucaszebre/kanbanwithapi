import styles from '@/styles/Deletethisboard.module.css';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import { DataContext } from '@/contexts/datacontext';
import { useTheme } from '@/contexts/themecontext';
import supabase from '@/supabase';
import axios from 'axios';
import { useMutation,useQueryClient,useQuery } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';


const DeleteThisBoard = () => {
    const { DeleteBlock, setDeleteBlock } = useContext(Opencontext); // state to toggle the display of the components
    const { currentBoardIndex,setCurrentBoardIndex} = useContext(DataContext);  // state to manage the global data 
        const { theme, setTheme } = useTheme();
    const {data,isLoading,isError} = useQuery({
        queryKey:['Boards'],
        queryFn:()=>fetchBoards(),
        });
    

    const queryClient = useQueryClient()
    const mutation = useMutation(
        ( boardId: string) =>
        deleteBoard(boardId),
        {
        onSuccess: () => {
            queryClient.invalidateQueries(['Boards']);
        },
        }
    );

    
      if(isLoading){
        return <p>Loading...</p>
      }
      if(isError){
        return <p>
          Something went wrongs
        </p>
      }
      const deleteBoard = async (boardId: string) => {  // function to delete the baord in the firestore 
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const response = await axios.delete(
                    `http://localhost:4000/user/${user.id}/boards/${boardId}`,
                    );
            
                    if (response.data) {
                    // Assuming the response data is an array of boards
                    console.log('The boards has been deleted');
                    } else {
                    console.error('Error fetching boards');
                    }
                    localStorage.setItem('currentBoardIndex', '0');
                    setCurrentBoardIndex(0)
            }
        } catch (error) {
            console.error('Error while deleting the board:', error);
        }
    };
    return (
        <div className={styles.DeleteThisBoardWrapper} style={{ display: DeleteBlock ? 'flex' : 'none' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setDeleteBlock(false);
                }}}>
            <div className={`${styles.DeletethisBoardDiv} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>
                <h1 className={styles.DeleteThisBoardTitle}>Delete this board?</h1>
                <p className={styles.DeleteThisBoardText}>
                    Are you sure you want to delete the ‘<a >{data.Boards[currentBoardIndex].name}</a>’ board? This action will remove all columns and tasks
                    and cannot be reversed.
                </p>
                <div className={styles.DeleteThisBoardButtons}>
                    <button
                        onClick={() => {
                            mutation.mutate(data.Boards[currentBoardIndex]._id);
                            setCurrentBoardIndex(0);
                            setDeleteBlock(false);
                        }}
                        className={styles.DeleteButton}
                    >
                        Delete
                    </button>
                    <button className={styles.CancelButton} onClick={() => setDeleteBlock(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteThisBoard;

