import React from 'react';
import  styles from '@/styles/NoBoards.module.css'; // Import the CSS file
import  { useContext } from 'react';
import { Opencontext } from '@/contexts/contextopen';  // get the context to toggle the board 

 const NoBoard = () => {
  const { setAddBoard } = useContext(Opencontext);  // state to toggle the display of the Add Board components

    return (
      <div className={styles.noBoardContainer}>
        <p className={styles.noBoardMessage}>You have no boards. Add one!</p>
        <button className={styles.addBoardButton} onClick={()=>{setAddBoard(true)}}>
          Add Board
        </button>
      </div>
    );
  };

export default NoBoard
  

  
  
  
  
  

