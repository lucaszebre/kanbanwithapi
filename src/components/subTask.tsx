import React from 'react';
import styles from '@/styles/Subtasks.module.css';
import { DataContext } from '@/contexts/datacontext';
import { useContext } from 'react';
import { useTheme } from '@/contexts/themecontext';
import { toggleSubtaskCompletion } from '@/utils/ToggleSubtask';
import { useMutation,useQueryClient } from 'react-query';
const Subtasks = (props: { title: string , checked: boolean  ,colunmId:string,taskId:string ,subtaskId:string }) => {

  const { theme, setTheme } = useTheme();

  const {SetIsMoving,isMoving,currentBoardId } = useContext(DataContext); // state to update the whole data of the app
  const [isChecked, setIsChecked] = React.useState<boolean>(props.checked); // state to able to toggle the checkbox

  React.useEffect(() => {  // everytime we check the checkbox we change the value of IsChecked
    setIsChecked(props.checked);
  }, [props.checked]);
  const queryClient = useQueryClient()
        const mutation = useMutation(
            (formdata:{ isCompleted:boolean,  subtaskId:string }) =>
            toggleSubtaskCompletion(formdata.isCompleted,  formdata.subtaskId),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['Task','boards']);
            },
            }
        );
  return (
    <div
      className={`${styles.SubtasksDiv} ${
        theme === 'light' ? styles.light : styles.dark
      }`}
      style={{
        height: isChecked ? '40px' : 'auto',}}>
      
        <input type="checkbox" checked={isChecked}
            onChange={() => {
            mutation.mutate({isCompleted:!isChecked,subtaskId:props.subtaskId});
            setIsChecked(!isChecked);

            SetIsMoving(!isMoving)}} />
        <p
          className={styles.SubtaskTitle}
          style={{
            textDecoration: isChecked ? 'line-through' : 'none',
            color: isChecked? '#BDBDBD' : 'white',
          }}
        >
          {props.title}
        </p>
    </div>
  );
};

export default Subtasks;
