import styles from '@/styles/Deletethisboard.module.css';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import { DataContext } from '@/contexts/datacontext';
import { useTheme } from '@/contexts/themecontext';
import supabase from '@/supabase';
import axios from 'axios';

const DeleteThisBoard = () => {
    const { DeleteBlock, setDeleteBlock } = useContext(Opencontext); // state to toggle the display of the components
    const { boards,
        setBoards,
        currentBoardId,
        setCurrentBoardId,
        SetIsMoving,isMoving,
        headerTitle } = useContext(DataContext);  // state to manage the global data 
        const { theme, setTheme } = useTheme();

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
            setBoards(prevBoards => prevBoards.filter(board => board._id !== boardId));
            SetIsMoving(!isMoving)
            setCurrentBoardId(boards[0]._id)
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
                    Are you sure you want to delete the ‘<a >{headerTitle}</a>’ board? This action will remove all columns and tasks
                    and cannot be reversed.
                </p>
                <div className={styles.DeleteThisBoardButtons}>
                    <button
                        onClick={() => {
                            deleteBoard(currentBoardId);
                            setDeleteBlock(false);
                            SetIsMoving(!isMoving)
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

