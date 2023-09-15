import React, { useEffect, useState } from 'react';
import ModalTask from './modalTask'
import styles from '../styles/TaskCard.module.css';
import { Subtask } from '@/types';
import { Opencontext } from '@/contexts/contextopen';
import { useContext } from 'react';
import { DataContext } from '@/contexts/datacontext';
import { useTheme } from '@/contexts/themecontext';


const TaskCard = (props: {index:number,title: string;description: string;id: string;subtask: Subtask[];columnId:string,onClick:() => void,columnIndex:number}) => {

  const { SubTasks, setSubTasks } = useContext(Opencontext); // state to be able to toggle the subTaskk
  const {currentTaskId,SetCurrentTaskId,setColId,openedTask,setCurrentColumnIndex,isMoving} = useContext(DataContext) // state to able to manage the Global Data 
  const { theme, setTheme } = useTheme();
  const [number,setNumber]=useState(0)
  function Iscompleted(){  // function to get the amout of subtask completed 
    var i:number=0;
    if (props.subtask){
      for(const sub of props.subtask){
      if( sub.isCompleted){
        i++
      }}}
      
    return i }
   

  useEffect(()=>{
    const number = Iscompleted()
    setNumber(number)
  },[isMoving])

  return (
    <>
    {openedTask &&
    <ModalTask
        columnId={openedTask.columnId}
        id={openedTask.id}
        title={openedTask.title}
        description={openedTask.description}
        subTask={openedTask.subTask}
        index={props.index}
        numberSub={number}
        /> }

    <div 
    className={`${styles.TaskCardContainer} ${
      theme === 'light' ? styles.light : styles.dark
    }`}
    onClick={
      ()=>{
        setSubTasks(true)
        props.onClick();
        SetCurrentTaskId(props.id)
        setColId(props.columnId)
        setCurrentColumnIndex(props.columnIndex)
      }
    }
    >
        <h1 
        className={`${styles.TaskCardTitle} ${
          theme === 'light' ? styles.light : styles.dark
        }`}
        >
          {props.title}
        </h1>
        <p className={styles.TaskCardP}>
          {Iscompleted()} of {props.subtask.length} substacks
        </p>
    </div>
    </>

  );
};

export default TaskCard;
