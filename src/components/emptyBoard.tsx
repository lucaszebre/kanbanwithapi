import { Opencontext } from '@/contexts/contextopen';
import { useContext, useState } from 'react';
import styles from '../styles/EmptyBoard.module.css';
import AddBoard from './addBoard';
import EditBoard from './editBoard/editBoard';

const EmptyBoard = (props:{Boards:boolean}) => {
  
  const [addBoard,setAddBoard] = useState(false)
  const [editBoard,setEditBoard] = useState(false)
if(props.Boards){
  return (
    <>
    <EditBoard editBoard={editBoard} setEditBoard={setEditBoard} />
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
    </>
  );
}else{
  return (
    <>
    <AddBoard addBoard={addBoard} setAddBoard={setAddBoard} />
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
    </>
  )
}
};

export default EmptyBoard;
