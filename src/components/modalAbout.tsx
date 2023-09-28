import styles from '../styles/modalAbout.module.css';
import { useTheme } from '@/state/themecontext';
import {useStore}
 from '@/state/contextopen';

const ModalAbout = (props: {right: string;top: string;visible: boolean,editBoard:boolean,setEditBoard:React.Dispatch<React.SetStateAction<boolean>>,setDeleteBlock:React.Dispatch<React.SetStateAction<boolean>>}) => {

  // state to toggle the display of the Delete Components or the EditBoard 
  const {
    setIsOpenModal,
  } = useStore()
  const { theme} = useTheme();


  function HandleClickDelete() {  // function display the delete block 
    props.setDeleteBlock(true);
    setIsOpenModal(false);
  }

  function HandleClickEdit() { // function to display the EditBoard 
    props.setEditBoard(true);
    setIsOpenModal(false)
  }
  
  return (
    <>
    
    <div className={styles.ModalWrapper}>
      <div
        className={`${styles.modalAboutDiv} ${
          theme === 'light' ? styles.light : styles.dark
        }`}
        style={{
          top: props.top,
          right: props.right,
          display: props.visible ? 'flex' : 'none',
        }}
      >
        <p
          className={styles.EditModalAbout}
          onClick={() => HandleClickEdit()}
        >
          Edit Board
        </p>
        <p
          className={styles.DeleteModalAbout}
          onClick={() => HandleClickDelete()}
        >
          Delete Board
        </p>
      </div>
    </div>
    </>
  );
};

export default ModalAbout;
