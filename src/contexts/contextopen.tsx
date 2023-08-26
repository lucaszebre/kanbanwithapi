


import React, { createContext, useContext, useState } from 'react';

// import { useData } from './boardcontext';
export type contextopen = { // Type for context
    isOpenModal: boolean; // Delete block state
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>; // Delete block state setter
    AddTask: boolean; // Delete block state
    setAddTask: React.Dispatch<React.SetStateAction<boolean>>; // Delete block state setter
    SubTasks: boolean; // Delete block state
    setSubTasks: React.Dispatch<React.SetStateAction<boolean>>; // Delete block state setter
    isChanged: boolean; // Delete block state
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>; // Delete block state setter
    EditTask:boolean;
    setEditTask:React.Dispatch<React.SetStateAction<boolean>>;
    DeleteTaskBlock:boolean,
    setDeleteTaskBlock:React.Dispatch<React.SetStateAction<boolean>>;


};

export const Opencontext = createContext<contextopen>({ // Create context
    isOpenModal : false , setIsOpenModal: () => {},
    AddTask: false,
    setAddTask: () => {},
    SubTasks: false,
    setSubTasks: () => {},
    isChanged: false,
    setIsChanged: () => {},
    EditTask: false,
    setEditTask:()=>{},
    DeleteTaskBlock:false,
    setDeleteTaskBlock:()=>{},

    
});


export type BoardType = {
    id: string;
    name: string;
    };






const ContextOpen = (props: { children: React.ReactNode }) => { // Context provider
    const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false)  // Set initial state for the Open Modal
    const [AddTask, setAddTask] = useState<boolean>(false);  // Set initial state for Add Task
    const [SubTasks, setSubTasks] = useState<boolean>(false);  // Set initial state for Sub Tasks
    const [isChanged, setIsChanged] = useState<boolean>(false);  // Set initial state for Add Board
    const [EditTask, setEditTask]= useState<boolean>(false);
    const [DeleteTaskBlock, setDeleteTaskBlock]=useState<boolean>(false)

    // const {BoardId, setBoardId} = useData();

    return (
        <Opencontext.Provider
        value={{
            isOpenModal, setIsOpenModal,
            AddTask,setAddTask
            ,SubTasks,setSubTasks
            ,isChanged,setIsChanged,
            EditTask, setEditTask,
            DeleteTaskBlock, setDeleteTaskBlock,

        }}
        >
        {props.children}
        </Opencontext.Provider>
    );
    };

export default ContextOpen;