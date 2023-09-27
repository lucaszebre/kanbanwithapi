import { Subtask } from '@/types';
import {create} from 'zustand';

type OpenedTaskType = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  subTask: Subtask[];
} | null;

type DataStore = {
  currentBoardIndex: number;
  setCurrentBoardIndex: (boardId: number) => void;
  interval: number;
  setInterval: (interval: number) => void;
  openedTask: OpenedTaskType;
  setOpenedTask: (task: OpenedTaskType) => void;
  isCompleted: number;
  setIsCompleted: (isCompleted: number) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  currentBoardIndex:
    typeof window !== 'undefined'
      ? parseInt(localStorage.getItem('currentBoardIndex') || '0', 10)
      : 0,
  interval: 100000,
  openedTask: null,
  isCompleted: 0,
  isLoggedIn: false,
  setCurrentBoardIndex: (boardId) => set({ currentBoardIndex: boardId }),
  setInterval: (newInterval) => set({ interval: newInterval }),
  setOpenedTask: (task) => set({ openedTask: task }),
  setIsCompleted: (newCompleted) => set({ isCompleted: newCompleted }),
  setIsLoggedIn: (newLoggedIn) => set({ isLoggedIn: newLoggedIn }),
}));


