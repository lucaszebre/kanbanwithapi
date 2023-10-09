/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Column, Subtask ,Board} from '@/types/index';
import Cookies from 'js-cookie';


type openedTaskType= {
    id: string;
    title: string;
    description: string;
    columnId: string;
    subTask: Subtask[];
} | null 
export type DataContextType = {
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
        openedTask, setOpenedTask,
        Interval,setInterval,isCompleted,setIsCompleted,
        isLoggedIn, setIsLoggedIn
        }}>{props.children}</DataContext.Provider>
    );
    };
