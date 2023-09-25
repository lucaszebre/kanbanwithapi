import styles from "../../styles/EditBoard.module.css";
import { useState,useContext,useEffect } from "react";
import { DataContext } from '@/state/datacontext';
import BoardColumn from "../boardColumn";
import { Column } from "@/types";
import { handleSaveChanges } from "./handleSave";
import { useTheme } from '@/state/themecontext';
import { useQuery,useMutation,useQueryClient } from 'react-query';
import { fetchBoards } from '@/utils/fetchBoard';
import {  ColumnData } from "@/types";
import Skeleton from "react-loading-skeleton";
const EditBoard = (props:{editBoard:boolean,setEditBoard:React.Dispatch<React.SetStateAction<boolean>>}) => {

const [copyBoardColumns, setCopyBoardColumns] = useState<Column[]>([]);// state to know the current present in the database
const [Header,setHeader]= useState<string>(''); // state to know the current boardname selected
const [Save,SetSave]= useState<boolean>(false) // state to toggle the disabled thhe button save 
const { currentBoardIndex,SetIsMoving,isMoving} = useContext(DataContext); // state to manage the global data
const [columnErrors, setColumnErrors] = useState<boolean[]>([]); // state to handle if one input is empty 
const [inputError, setInputError] = useState<boolean>(false); // state to handle if the boardname is empty 
const [columnstoAdd, setColumnstoAdd] = useState<Column[]>([]); // state to know the column to add in the database
const [columnsToDelete, setColumnsToDelete] = useState<string[]>([]);  // state to know the column to delete in the database
const [columnsToRename, setColumnsToRename] = useState<ColumnData[]>([]);// state to know the column to rename in the database
const { theme } = useTheme();



const {data,isLoading,isError} = useQuery({
    queryKey:['boards'],
    queryFn:()=>fetchBoards(),
    });
    
useEffect(()=>{
    setColumnstoAdd([])
    setColumnsToRename([])
    setColumnsToDelete([])
},[Save])

    useEffect(() => {
        if(data && data.boards[currentBoardIndex] && data.boards[currentBoardIndex].columns){
            setCopyBoardColumns(data.boards[currentBoardIndex].columns);
            setHeader(data.boards[currentBoardIndex].name)
            const initialColumnErrors = data.boards[currentBoardIndex].columns.map((column: { name: string; }) => column.name.trim() === "");
            setColumnErrors(initialColumnErrors);}
    }, [currentBoardIndex, data, isMoving]);  // every some thing is moving in the data we get the new headertiltle and columns of the currentboard 


    const handleAddColumn = () => { // function to add column 
        const newColumn = {
        id:'',
        name: "",
        tasks: [],
        add:true
        };
        setCopyBoardColumns([...copyBoardColumns, newColumn]);
        setColumnstoAdd([...columnstoAdd, newColumn]);
    };

    function handleDeleteColumn(index: number, columnId: string) { // function to delete column
        const updatedColumns = [...copyBoardColumns];
        updatedColumns.splice(index, 1);
        setCopyBoardColumns(updatedColumns);
        setColumnsToDelete([...columnsToDelete, columnId]);
    
        // Filter out the deleted column from columnsToRename
        const updatedColumnsToRename = columnsToRename.filter(
            (column) => column.id !== columnId
        );
        setColumnsToRename(updatedColumnsToRename);
    
        // Update columnErrors state by removing the corresponding error
        const updatedColumnErrors = [...columnErrors];
        updatedColumnErrors.splice(index, 1);
        setColumnErrors(updatedColumnErrors);
    }
    

    const handleEditColumn = (index: number, columnName: string, add?: boolean) =>{
        const updatedColumns = [...copyBoardColumns];
        updatedColumns[index] = { ...updatedColumns[index], name: columnName };
        setCopyBoardColumns(updatedColumns);
        
        const updatedColumnErrors = [...columnErrors];
        updatedColumnErrors[index] = columnName.trim() === '';
        setColumnErrors(updatedColumnErrors);
    
        if (add) {
            const existingColumnIndex = columnstoAdd.findIndex((c) => c.id === updatedColumns[index].id);
            if (existingColumnIndex !== -1) {
                const updatedColumnsToAdd = [...columnstoAdd];
                updatedColumnsToAdd[existingColumnIndex] = updatedColumns[index];
                setColumnstoAdd(updatedColumnsToAdd);
            }
        } else {
            const existingColumnIndex = columnsToRename.findIndex((c) => c.id === updatedColumns[index].id);
            if (existingColumnIndex === -1) {
                setColumnsToRename([...columnsToRename, updatedColumns[index]]);
            } else {
                const updatedColumnsToRename = [...columnsToRename];
                updatedColumnsToRename[existingColumnIndex] = updatedColumns[index];
                setColumnsToRename(updatedColumnsToRename);
            }
        }
    };
    
    
function renderColumns() {  
    return copyBoardColumns.map((column, index) => (
        <BoardColumn
            key={index}
            title={column.name}
            onChange={(updatedTitle: string) =>handleEditColumn(index,updatedTitle,column.add)}
            Remove={ ()=> handleDeleteColumn(index,column.id) }
            error={columnErrors[index] || false}
        />
    ));
}

        const queryClient = useQueryClient()
        const mutation = useMutation(
            (formData: { columnsToDelete:string[],columnsToRename:ColumnData[],columnstoAdd:Column[],currentBoardId:string,Header:string,headerTitle:string }) =>
            handleSaveChanges(formData.columnsToDelete, formData.columnsToRename,formData.columnstoAdd,formData.currentBoardId,formData.Header,formData.headerTitle),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['boards']);
            },
            }
        );
        
        const mutationed = useMutation(
            () =>
            fetchBoards(),
            {
            onSuccess: () => {
                queryClient.invalidateQueries(['boards']);
            },
            }
        );

        if (isLoading) {
            return (
                <div
                    className={styles.EditBoardWrapper}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            SetIsMoving(isMoving => !isMoving);
                            props.setEditBoard(false);
                        }
                    }}
                    style={{ display: props.editBoard ? "flex" : "none" }}
                >
                    <div
                        className={`${styles.EditBoardBlock} ${
                            theme === "light" ? styles.light : styles.dark
                        }`}
                    >
                        <Skeleton height={30} width={200} style={{ marginBottom: "10px" }} />
                        <div className={styles.SkeletonBoardColumn}>
                            <Skeleton height={30} width={100} style={{ marginBottom: "10px" }} />
                            <Skeleton height={30} width={100} style={{ marginBottom: "10px" }} />
                            <Skeleton height={30} width={100} style={{ marginBottom: "10px" }} />
                            {/* Add more skeletons for each column */}
                        </div>
                        <Skeleton height={40} width={100} style={{ marginBottom: "10px" }} />
                    </div>
                </div>
            );
        }
    if(isError){
        return <p>
        Something went wrongs
        </p>
    }
    return (
    <div className={styles.EditBoardWrapper}
        onClick={(e) => {
            if (e.target === e.currentTarget) {
            SetIsMoving(isMoving => !isMoving);
            mutationed.mutate();
            props.setEditBoard(false);
            }}}
        style={{
            display: props.editBoard ? "flex" : "none", // toggle the display 
        }}>
        <div 
        className={`${styles.EditBoardBlock} ${
            theme === 'light' ? styles.light : styles.dark
            }`}>
            <h1 className={`${styles.EditBoardTitle} ${
                theme === 'light' ? styles.light : styles.dark
                }`}>Edit Board</h1>
            <form action="" className={styles.EditBoardForm} 
                onSubmit={async (e) => {
                    e.preventDefault();
                    
                    const newColumnErrors = copyBoardColumns.map((column) => column.name.trim() === "");
                    setColumnErrors(newColumnErrors);
                    if(Header.trim()===''){
                        setInputError(true);
                    }else if (newColumnErrors.some((error) => error)) {
                        return;
                    }else{
                        mutation.mutate({columnsToDelete, columnsToRename,columnstoAdd:columnstoAdd,currentBoardId:data.boards[currentBoardIndex].id,Header,headerTitle:data.boards[currentBoardIndex].name})
                        props.setEditBoard(false);
                        SetSave(!Save);
                        SetIsMoving(isMoving=>!isMoving)
                    }
                    
                    
                }}
                >
                <label className={`${styles.EditLabel} ${
                theme === 'light' ? styles.light : styles.dark
                }`} htmlFor="boardName">
                    Board Name
                </label>
                <input
                    type="text"
                    name="boardName"
                    className={`${styles.EditBoardInput} ${
                        theme === 'light' ? styles.light : styles.dark
                        } ${inputError ? styles.InputError : ''}`}
                    value={Header}
                    onChange={(e) =>{ 
                        setInputError(false);
                        setHeader(e.target.value)
                    }}
                />
                {inputError && <div className={styles.ErrorMessage}>Please enter a board name.</div>}

                <label className={`${styles.EditLabel} ${
                theme === 'light' ? styles.light : styles.dark
                }`} htmlFor="boardDescription">
                    Board Columns
                </label>
                {renderColumns()}
                <button
                    className={`${styles.EditBoardAddButton} ${
                    theme === 'light' ? styles.light : styles.dark
                    }`}
                    onClick={(e) => {
                    e.preventDefault();
                    handleAddColumn();
                    }}
                >
                    + Add Column
                </button>
                <button
                    className={styles.EditBoardSaveButton}
                    type='submit'
                    
                >
                    Save Changes
                </button>
            </form>
        </div>
    </div>
    );
    };

export default EditBoard;
