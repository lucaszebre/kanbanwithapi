import {useStore}
 from '@/state/contextopen';
import styles from '../styles/modalAboutTask.module.css';
import { useTheme } from '@/state/themecontext';
import React from 'react'
const ModalAboutTask = (props: {visible: boolean;}) => {

    // state to toggle the display of the Delete task Block or the EditTask components 
    const {
        setIsOpenModal,
        setSubTasks,
        
        setEditTask,
        setDeleteTaskBlock,
      } = useStore()
    const { theme } = useTheme();


    function HandleClickDelete() {  // function to display the DeleteTask Block 
        setDeleteTaskBlock(true);
        setIsOpenModal(false);
        setSubTasks(false)

    }

    function HandleClickEdit() { // function to display the Edit Task Block 
        setEditTask(true);
        setIsOpenModal(false);
        setSubTasks(false);
        
    }
    
    return (
        <div className={styles.ModalWrapper}>
            <div
                className={`${styles.modalAboutDiv} ${
                    theme === 'light' ? styles.light : styles.dark
                  }`}
                style={{  display: props.visible ? 'flex' : 'none',}}
                >
                <p
                className={styles.EditModalAbout}
                onClick={() => HandleClickEdit()}
                >
                Edit Task
                </p>
                <p
                className={styles.DeleteModalAbout}
                onClick={() => HandleClickDelete()}
                >
                Delete Task
                </p>
            </div>
        </div>
    );
};

export default ModalAboutTask;
