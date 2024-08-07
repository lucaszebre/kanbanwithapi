import React, { useState } from 'react';
import styles from '../styles/AddBoard.module.css';  // styles modules css 
import { ColumnsRenderer } from './addTask/rendercolumn';  // get the render columns 
import { useTheme } from '@/state/themecontext';
import { useMutation,useQueryClient } from 'react-query';
import { createBoard } from '@/utils/createBoard';
import { useTaskManagerStore } from '@/state/taskManager';
import toast from 'react-hot-toast';

const AddBoard = (props:{addBoard:boolean,setAddBoard:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [boardName, setBoardName] = useState<string>('');   // Boardname state 
    const [columnNames, setColumnNames] = useState<string[]>(['', '']); // COlumns Names state 
    const [inputError, setInputError] = useState<boolean>(false);   // state to manage is the input of board name is empty 
    const [columnErrors, setColumnErrors] = useState<boolean[]>([]);  // state to manage is one of the column name input is empty 
    const { theme } = useTheme();

    const addBoard = useTaskManagerStore(state=> state.addBoard)

    React.useEffect(()=>{    // when we add a board we use ismoving to update the data and then here we set the current state to the             // the iniatial value 
        setBoardName('');
        setColumnNames(['', '']);
    },[])

// ********************************************************************

const resetForm = () => {  // function to reset the form 
    setBoardName('');
    setColumnNames(['', '']);
    props.setAddBoard(false);
    };

    

        const queryClient = useQueryClient()
        const mutation = useMutation(
            (formData: { boardName: string; columns: string[] }) =>
            createBoard(formData.boardName, formData.columns),
            {
            onSuccess: () => {
                queryClient.refetchQueries(['boards']);
                toast.success("Add board sucessfully")
            },
            onError:()=>{
                toast.error("Error to add the board!")
            }
            }
        );

const handleSubmit = async (e: React.FormEvent) => {  // function to handle the final form data 
    e.preventDefault();

    const newColumnErrors = columnNames.map(columnName => columnName.trim() === "");
    setColumnErrors(newColumnErrors);

    if (boardName.trim() === "") {
        setInputError(true);
        return;
        } else if (newColumnErrors.some(error => error)) {
        return;
    }
    addBoard(boardName,columnNames)
    mutation.mutate({boardName,columns:columnNames})
    resetForm();
    };


    const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {  // handle the change of the board name
        setBoardName(e.target.value);
        setInputError(false);
    };

    const handleColumnTitleChange = (index: number, updatedTitle: string) => { // handle the change of column title
        const updatedColumns = [...columnNames];
        updatedColumns[index] = updatedTitle;
        setColumnNames(updatedColumns);
    };

    const addColumn = () => { // function to  add a column
        setColumnNames([...columnNames, '']);
    };

    const removeColumn = (index: number) => {  // function to remove a column
        const newColumns = [...columnNames];
        newColumns.splice(index, 1);
        setColumnNames(newColumns);
    };
        
        //*************************************************************** */
    
    return (
    <div className={styles.AddBoardWrapper}
        style={{ display: props.addBoard ? 'flex' : 'none' }}  // toggle the display of addBoard components 
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    props.setAddBoard(false)
                }}}>

        <div 
        className={`${styles.AddBoardBlock} ${
            theme === 'light' ? styles.light : styles.dark
            }`}>
            <h1 className={styles.AddBoardTitle}>Add Board</h1>
            <form className={styles.FormAddBoard} 
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit(e)
                }}
                    
                    >

                <label className={`${styles.LabeladdBoard} ${
                    theme === 'light' ? styles.light : styles.dark }`} htmlFor="boardName">Board Name</label>
                <input className={`${styles.InputAddBoard} ${
                    theme === 'light' ? styles.light : styles.dark } ${inputError ? styles.InputError : ''}`}
                    type="text"
                    id="boardName"
                    placeholder="eg Web design"
                    onChange={(e) => {
                        handleBoardNameChange(e);
                    }}
                    value={boardName}
                    />
                {inputError && <div className={styles.ErrorMessage}>Please enter a board name.</div>}
                <label className={`${styles.LabeladdBoard} ${
                    theme === 'light' ? styles.light : styles.dark }`}  htmlFor="boardColumns">Board Columns</label>
                            <ColumnsRenderer 
                            columnNames={columnNames} 
                            handleColumnTitleChange={handleColumnTitleChange}
                            removeColumn={removeColumn} 
                            columnErrors={columnErrors} />
                <button disabled={inputError} type="button"  className={`${styles.AddBoardButton} ${
                    theme === 'light' ? styles.light : styles.dark }`}  onClick={addColumn}>+ Add Column</button>
                <button className={styles.AddBoardSaveButton} type="submit">Create Board</button>
            </form>
        </div>
    </div>
                );
        
        };
        
export default AddBoard;
        

