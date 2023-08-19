/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Column, Subtask ,Board} from '@/types/index';
import axios from 'axios';
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
    currentBoardId: string;
    setCurrentBoardId: (boardId: string) => void;
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
    setUserId:React.Dispatch<React.SetStateAction<string>>;
    userId:string
    token:string;
    setToken:React.Dispatch<React.SetStateAction<string>>;

};


export const DataContext = createContext<DataContextType>({} as DataContextType);



export const DataProvider = (props: { children: React.ReactNode }) => {
    const [userId,setUserId] = useState('64dec65f5c205b769e3d2af2');
    const [token,setToken] = useState('')
    const [boards, setBoards] = useState<Board[]>([]);
    const [columns,setColumns]= useState<Column[]>([])
    const [currentBoard,setCurrentBoard]= useState<Board>()
    const [currentBoardId, setCurrentBoardId] = useState<string>('');
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


        useEffect(() => {
            const fetchData = async () => {
                try {
                    const headers = { Authorization: `Bearer ${token}` };
            
                    const response = await axios.get(
                    `https://kanbantask.onrender.com/user/64dec65f5c205b769e3d2af2`,
                    { headers }
                    );
            
                    if (response.data) {
                    // Assuming the response data is an array of boards
                    setBoards(response.data);
                    console.log('data',response.data);
                    } else {
                    console.error('Error fetching boards');
                    }
                } catch (error) {
                    console.error('Fetching boards', error);
                }
                };
            
                fetchData();
            }, []);
            

    return (
        <DataContext.Provider value={{
        boards,
        setBoards,
        currentBoardId,
        setCurrentBoardId,
        headerTitle,
        setHeaderTitle,
        columns,setColumns,
        currentBoard,setCurrentBoard,
        isMoving,SetIsMoving,
        isCompleted,setIsCompleted,
        SetCurrentTaskId,currentTaskId,
        ColId,setColId,
        openedTask, setOpenedTask,
        setUserId,userId,
        token,setToken
        }}>{props.children}</DataContext.Provider>
    );
    };
