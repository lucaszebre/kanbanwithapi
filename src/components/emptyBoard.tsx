import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import styles from '../styles/EmptyBoard.module.css';

const EmptyBoard = (props:{Boards:boolean}) => {
  
  const { setEditBoard,setAddBoard } = useContext(Opencontext);

if(props.Boards){
  return (
    <div className={styles.emptyBoardDiv}>
      <h1 className={styles.emptyBoardTitle}>
        This board is empty. Create a new column to get started.
      </h1>
      <button
        onClick={() => { setEditBoard(true) }} 
      className={styles.emptyBoardButton}>
        + Add New Column
      </button>
    </div>
  );
}else{
  return (
    <div className={styles.emptyBoardDiv}>
      <h1 className={styles.emptyBoardTitle}>
        You have no boards you should create one Boards to start.
      </h1>
      <button
        onClick={() => { setAddBoard(true) }} 
      className={styles.emptyBoardButton}>
        + Add a Boards
      </button>
    </div>
  )
}
};

export default EmptyBoard;
