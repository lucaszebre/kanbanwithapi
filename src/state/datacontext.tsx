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
    setCurrentBoardIndex: (boardId: number) => void;
    Interval:number;
    setInterval:React.Dispatch<React.SetStateAction<number>>;
    openedTask:openedTaskType;
    setOpenedTask:React.Dispatch<React.SetStateAction<openedTaskType>>;
    isCompleted:number;
    setIsCompleted:React.Dispatch<React.SetStateAction<number>>;
    isLoggedIn:boolean, setIsLoggedIn:React.Dispatch<React.SetStateAction<boolean>>;
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
        
        const [Interval,setInterval] = useState<number>(100000);
        const [isCompleted,setIsCompleted] = useState(0)
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
        setCurrentBoardIndex,
        openedTask, setOpenedTask,
        Interval,setInterval,isCompleted,setIsCompleted,
        isLoggedIn, setIsLoggedIn
        }}>{props.children}</DataContext.Provider>
    );
    };
