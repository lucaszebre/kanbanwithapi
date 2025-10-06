/* eslint-disable react-hooks/exhaustive-deps */
import type { SubtaskType } from '@/types';
import React, { createContext, useState } from 'react';


type openedTaskType= {
    id: string;
    title: string;
    description: string;
    columnId: string;
    subTask: SubtaskType[];
} | null 
export type DataContextType = {
    openedTask:openedTaskType;
    setOpenedTask:React.Dispatch<React.SetStateAction<openedTaskType>>;
    isCompleted:number;
    setIsCompleted:React.Dispatch<React.SetStateAction<number>>;
    isLoggedIn:boolean, setIsLoggedIn:React.Dispatch<React.SetStateAction<boolean>>;
};


export const DataContext = createContext<DataContextType>({} as DataContextType);



export const DataProvider = (props: { children: React.ReactNode }) => {

        
        const [isCompleted,setIsCompleted] = useState(0)
        const [openedTask, setOpenedTask] = useState<{
            id: string;title: string;
            description: string;
            columnId: string;
            subTask: SubtaskType[];
            } | null>(null);
        const [isLoggedIn, setIsLoggedIn] = useState(false);

        
            
            

    return (
        <DataContext.Provider value={{
        openedTask, setOpenedTask,
        isCompleted,setIsCompleted,
        isLoggedIn, setIsLoggedIn
        }}>{props.children}</DataContext.Provider>
    );
    };
