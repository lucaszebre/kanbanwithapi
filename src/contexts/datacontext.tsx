/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Column, Subtask ,Board} from '@/types/index';


type openedTaskType= {
    id: string;
    title: string;
    description: string;
    columnId: string;
    subTask: Subtask[];
} | null 
type DataContextType = {
    currentBoardIndex: number;
    currentColumnIndex: number;
    currentBoardId: string;
    setCurrentColumnIndex: (boardId: number) => void;
    setCurrentBoardIndex: (boardId: number) => void;
    setCurrentBoardId: (boardId:string) => void;
    headerTitle: string;
    setHeaderTitle: (title: string) => void;
    isMoving:boolean;
    SetIsMoving:React.Dispatch<React.SetStateAction<boolean>>;
    currentTaskId:string;
    Interval:number;
    SetCurrentTaskId:React.Dispatch<React.SetStateAction<string>>;
    setInterval:React.Dispatch<React.SetStateAction<number>>;
    ColId:string;
    setColId:React.Dispatch<React.SetStateAction<string>>;
    openedTask:openedTaskType;
    setOpenedTask:React.Dispatch<React.SetStateAction<openedTaskType>>;
    isCompleted:number;
    setIsCompleted:React.Dispatch<React.SetStateAction<number>>;
    isLoggedIn:boolean, setIsLoggedIn:React.Dispatch<React.SetStateAction<boolean>>;
    tokenExpiration:any, setTokenExpiration:React.Dispatch<React.SetStateAction<any>>
};


export const DataContext = createContext<DataContextType>({} as DataContextType);



export const DataProvider = (props: { children: React.ReactNode }) => {
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
        const [Interval,setInterval] = useState<number>(100000);
        const [tokenExpiration, setTokenExpiration] = useState(null);
        const [isMoving,SetIsMoving] = useState(false)
        const [isCompleted,setIsCompleted] = useState(0)
        const [currentTaskId,SetCurrentTaskId]=React.useState<string>('')
        const [ColId,setColId] = React.useState<string>('')
        const [openedTask, setOpenedTask] = useState<{
            id: string;title: string;
            description: string;
            columnId: string;
            subTask: Subtask[];
            } | null>(null);
        const [isLoggedIn, setIsLoggedIn] = useState(false);

        
            
            

    return (
        <DataContext.Provider value={{
        currentBoardIndex,
        currentColumnIndex,
        currentBoardId,
        setCurrentBoardIndex,
        setCurrentColumnIndex,
        setCurrentBoardId,
        headerTitle,
        setHeaderTitle,
        isMoving,SetIsMoving,
        SetCurrentTaskId,currentTaskId,
        ColId,setColId,
        openedTask, setOpenedTask,
        Interval,setInterval,isCompleted,setIsCompleted,
        isLoggedIn, setIsLoggedIn,tokenExpiration, setTokenExpiration
        }}>{props.children}</DataContext.Provider>
    );
    };
