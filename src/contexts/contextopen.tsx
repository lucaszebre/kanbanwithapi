import {create} from 'zustand';

// Define your Zustand store
type ContextStore = {
    isOpenModal: boolean;
    setIsOpenModal: (value: boolean) => void;
    AddTask: boolean;
    setAddTask: (value: boolean) => void;
    SubTasks: boolean;
    setSubTasks: (value: boolean) => void;
    isChanged: boolean;
    setIsChanged: (value: boolean) => void;
    EditTask: boolean;
    setEditTask: (value: boolean) => void;
    DeleteTaskBlock: boolean;
    setDeleteTaskBlock: (value: boolean) => void;
};

const useStore = create<ContextStore>((set) => ({
    isOpenModal: false,
    setIsOpenModal: (value) => set({ isOpenModal: value }),
    AddTask: false,
    setAddTask: (value) => set({ AddTask: value }),
    SubTasks: false,
    setSubTasks: (value) => set({ SubTasks: value }),
    isChanged: false,
    setIsChanged: (value) => set({ isChanged: value }),
    EditTask: false,
    setEditTask: (value) => set({ EditTask: value }),
    DeleteTaskBlock: false,
    setDeleteTaskBlock: (value) => set({ DeleteTaskBlock: value }),
}));


export default useStore;
