/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Column, Subtask ,Board} from '@/types/index';
import axios from 'axios';
import supabase from '@/supabase';


type openedTaskType= {
    _id: string;
    title: string;
    description: string;
    columnId: string;
    subTask: Subtask[];
} | null 
type DataContextType = {
    boards: Board[];
    setBoards: React.Dispatch<React.SetStateAction<Board[] >>
    currentBoardIndex: number;
    currentColumnIndex: number;
    currentBoardId: string;
    setCurrentColumnIndex: (boardId: number) => void;
    setCurrentBoardIndex: (boardId: number) => void;
    setCurrentBoardId: (boardId:string) => void;
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
        const [currentBoardIndex, setCurrentBoardIndex] = useState<number>(
            typeof window !== 'undefined'
            ? parseInt(localStorage.getItem('currentBoardIndex') || '0', 10)
            : 0
        );
        const [currentColumnIndex, setCurrentColumnIndex] = useState<number>(
            typeof window !== 'undefined'
            ? parseInt(localStorage.getItem('currentColumnIndex') || '0', 10)
            : 0
        );
        
            const [currentBoardId, setCurrentBoardId] = useState<string>('');
        const [headerTitle, setHeaderTitle] = useState<string>('');
        const [isMoving,SetIsMoving] = useState(false)
        const [isCompleted,setIsCompleted] = useState(false)
        const [currentTaskId,SetCurrentTaskId]=React.useState<string>('')
        const [ColId,setColId] = React.useState<string>('')
        const [openedTask, setOpenedTask] = useState<{
            _id: string;title: string;
            description: string;
            columnId: string;
            subTask: Subtask[];
            } | null>(null);

        const onMountedAndUpdate = async () => {
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
                    setColumns(response.data[0].Boards[currentBoardIndex].columns)
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
                onMountedAndUpdate();
            }, [,currentBoardIndex,isMoving]);

            
            

    return (
        <DataContext.Provider value={{
        boards,
        setBoards,
        currentBoardIndex,
        currentColumnIndex,
        currentBoardId,
        setCurrentBoardIndex,
        setCurrentColumnIndex,
        setCurrentBoardId,
        headerTitle,
        setHeaderTitle,
        columns,setColumns,
        isMoving,SetIsMoving,
        isCompleted,setIsCompleted,
        SetCurrentTaskId,currentTaskId,
        ColId,setColId,
        openedTask, setOpenedTask,
        }}>{props.children}</DataContext.Provider>
    );
    };
