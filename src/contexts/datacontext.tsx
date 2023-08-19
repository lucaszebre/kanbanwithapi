/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Column, Subtask ,Board} from '@/types/index';
import axios from 'axios';
import supabase from '@/supabase';


type openedTaskType= {
    id: string;
    title: string;
    description: string;
    columnId: string;
    subTask: Subtask[];
} | null 
type DataContextType = {
    boards: Board[];
    setBoards: React.Dispatch<React.SetStateAction<Board[] >>
    currentBoardindex: number;
    setCurrentBoardindex: (boardId: number) => void;
    currentBoard:Board | undefined;
    setCurrentBoard: React.Dispatch<React.SetStateAction<Board |undefined>>;
    headerTitle: string;
    setHeaderTitle: (title: string) => void;
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    isMoving:boolean;
    SetIsMoving:React.Dispatch<React.SetStateAction<boolean>>;
    isCompleted:boolean;
    setIsCompleted:React.Dispatch<React.SetStateAction<boolean>>;
    currentTaskId:string;
    SetCurrentTaskId:React.Dispatch<React.SetStateAction<string>>;
    ColId:string;
    setColId:React.Dispatch<React.SetStateAction<string>>;
    openedTask:openedTaskType;
    setOpenedTask:React.Dispatch<React.SetStateAction<openedTaskType>>;

};


export const DataContext = createContext<DataContextType>({} as DataContextType);



export const DataProvider = (props: { children: React.ReactNode }) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [columns,setColumns]= useState<Column[]>([])
    const [currentBoard,setCurrentBoard]= useState<Board>()
    const [currentBoardindex, setCurrentBoardindex] = useState<number>(0);
    const [headerTitle, setHeaderTitle] = useState<string>('');
    const [isMoving,SetIsMoving] = useState(false)
    const [isCompleted,setIsCompleted] = useState(false)
    const [currentTaskId,SetCurrentTaskId]=React.useState<string>('')
    const [ColId,setColId] = React.useState<string>('')
    const [openedTask, setOpenedTask] = useState<{
        id: string;title: string;
        description: string;
        columnId: string;
        subTask: Subtask[];
        } | null>(null);

        const onMounted = async () => {
            try {
              // Check if the user is authenticated
            const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                // User is authenticated, check if a row exists in the "User" table
                const response = await axios.get(
                    `http://localhost:4000/user/${user.id}`,
                    );
            
                    if (response.data) {
                    // Assuming the response data is an array of boards
                    setBoards(response.data[0].Boards);
                    setColumns(response.data[0].Boards[0].columns)
                    console.log('data',response.data[0].Boards);
                    } else {
                    console.error('Error fetching boards');
                    }
                }
                } catch (error) {
                console.error(error);
            }
            };


        useEffect(() => {
                onMounted();
            }, []);
            

    return (
        <DataContext.Provider value={{
        boards,
        setBoards,
        currentBoardindex,
        setCurrentBoardindex,
        headerTitle,
        setHeaderTitle,
        columns,setColumns,
        currentBoard,setCurrentBoard,
        isMoving,SetIsMoving,
        isCompleted,setIsCompleted,
        SetCurrentTaskId,currentTaskId,
        ColId,setColId,
        openedTask, setOpenedTask,
        }}>{props.children}</DataContext.Provider>
    );
    };
