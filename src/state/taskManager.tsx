import {create} from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ColumnData, Subtasked } from '@/types';

type State = {
  taskManager: TaskManager;
  addBoard: (boardName: string,column:string[]) => void;
  updateBoard: (columnsToDelete:string[],columnsToRename:ColumnData[],columnstoAdd:Column[],currentBoardId:string,Header:string,headerTitle:string) => void;
  deleteBoard: (boardId: string) => void;


  addTask: (boardId:string,taskTitle:string,taskDescription:string,columnId:string,SubTaskCurrent?:string[]) => void;
  updateTask: (  
    taskId: string,
    taskName: string,
    taskDescription: string,
    subTasksToDelete: string[],
    subTasksToAdd:string[],
    subTasksToChange: Subtasked[],
    boardId: string,
    columnId: string) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;

  toggleSubtask: (boardId: string, columnId: string, taskId: string, subtaskId: string,isCompleted:boolean) => void;
  setTaskManagerData: (data:TaskManager) =>void;
};

export const useTaskManagerStore = create<State>((set) => ({
    taskManager: [{
        id: uuidv4(),
        name: '',
        email: '',
        boards: [],
    }],
    setTaskManagerData: (data:TaskManager) => set({ taskManager: data }),

    addBoard: (boardName, columnNames) => set((state) => {
        const columns = columnNames.map(name => ({
            id: uuidv4(),
            name,
            tasks: [],
        }));

        // Assuming the first user for simplicity
        const user = state.taskManager[0];

        return {
            ...state,
            taskManager: [{
                ...user,
                boards: [...user.boards, { id: uuidv4(), name: boardName, columns }]
            }],
        };
    }),

    updateBoard: (
        columnsToDelete: string[], // Assuming this is an array of column IDs to delete
        columnsToRename: ColumnData[],
        columnstoAdd: Column[],
        currentBoardId: string,
        Header: string,
        headerTitle: string
    ) => set((state) => {
        const updatedBoards = state.taskManager[0].boards.map(board => {
        if (board.id !== currentBoardId) return board;
    
        let updatedColumns = board.columns;
    
        // Delete columns
        updatedColumns = updatedColumns.filter(col => !columnsToDelete.includes(col.id));
    
        // Rename columns
        columnsToRename.forEach(renameData => {
            const column = updatedColumns.find(col => col.id === renameData.id);
            if (column) {
            column.name = renameData.name;
            }
        });
    
        // Add new columns
        updatedColumns = [...updatedColumns, ...columnstoAdd];
    
        // Return updated board
        return {
            ...board,
            name: Header === 'boardName' ? headerTitle : board.name, // assuming 'boardName' is the identifier for updating the board name
            columns: updatedColumns
        };
        });
    
        return {
        ...state,
        taskManager: {
            ...state.taskManager,
            boards: updatedBoards,
        }
        };
    })
    
    ,


  deleteBoard: (boardId) => set((state) => {
    const boards = state.taskManager[0].boards.filter((b) => b.id !== boardId);
    return {
      ...state,
      taskManager: {
        ...state.taskManager,
        boards,
      },
    };
  }),




  // Task


  addTask: (
    boardId: string,
    taskTitle: string,
    taskDescription: string,
    columnId: string,
    SubTaskCurrent?: string[]
  ) => set((state) => {
    const newTask: Task = {
      id: uuidv4(), // Use a function or library to generate unique IDs
      title: taskTitle,
      description: taskDescription,
      status:"to do", // Assuming Task type has a description property
      subtasks: SubTaskCurrent ? SubTaskCurrent.map(title => ({
        id: uuidv4(),
        title,
        isCompleted: false, // Assuming a default value
        taskId:uuidv4()
      })) : []
    };
  
    const board = state.taskManager[0].boards.find(b => b.id === boardId);
    const column = board?.columns.find(c => c.id === columnId);
    if (column) {
      column.tasks.push(newTask);
    }
  
    return { ...state };
  }),
 
  updateTask: (
    taskId: string,
    taskName: string,
    taskDescription: string,
    subTasksToAdd: string[],
    subTasksToDelete: string[],
    subTasksToChange: Subtasked[],
    boardId: string,
    columnId: string
) => set((state) => {
    // Find the board and column
    const board = state.taskManager[0].boards.find(b => b.id === boardId);
    if (!board) return state;  
    const column = board?.columns.find(c => c.id === columnId);
    
    if (!column) return state;  // If no column found, return the current state

    // Clone the tasks array for immutability
    const updatedTasks = [...column.tasks];

    // Find the task index (we'll use this to replace the task in the array)
    const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return state; // If no task found, return the current state

    const originalTask = updatedTasks[taskIndex];
    
    // Construct the updated task
    const updatedTask = {
        ...originalTask,
        title: taskName,
        description: taskDescription,
        subtasks: originalTask.subtasks
            .filter(subtask => !subTasksToDelete.includes(subtask.id))  // Remove subtasks to delete
            .map(subtask => {  // Update existing subtasks
                const change = subTasksToChange.find(s => s.id === subtask.id);
                if (change) {
                    return {
                        ...subtask,
                        title: change.title,
                        isCompleted: change.isCompleted
                    };
                }
                return subtask;
            })
            .concat(  // Add new subtasks
                subTasksToAdd.map(title => ({
                    id: uuidv4(),
                    title,
                    isCompleted: false,
                    taskId: taskId
                })),
                subTasksToChange
                    .filter(change => change.add)
                    .map(change => ({
                        id: uuidv4(),
                        title: change.title,
                        isCompleted: change.isCompleted,
                        taskId: taskId
                    }))
            )
    };

    // Replace the task in the array
    updatedTasks[taskIndex] = updatedTask;

    // Update the column's tasks
    const updatedColumns = board.columns.map(c => c.id === columnId ? { ...c, tasks: updatedTasks } : c);

    return {
        ...state,
        taskManager: {
            ...state.taskManager,
            boards: state.taskManager[0].boards.map(b => b.id === boardId ? { ...b, columns: updatedColumns } : b)
        }
    };
})

,

  deleteTask: (boardId, columnId, taskId) => set((state) => {
    const board = state.taskManager[0].boards.find(b => b.id === boardId);
    const column = board?.columns.find(c => c.id === columnId);
    if (column) {
      column.tasks = column.tasks.filter(t => t.id !== taskId);
    }
    return { ...state };
  }),
  
  // Subtask CRUD
  toggleSubtask: (boardId: string, columnId: string, taskId: string, subtaskId: string,isCompleted:boolean) => set((state) => {
    const board = state.taskManager[0].boards.find(b => b.id === boardId);
    const column = board?.columns.find(c => c.id === columnId);
    const task = column?.tasks.find(t => t.id === taskId);
    const subtask = task?.subtasks.find(s => s.id === subtaskId);
  
    if (subtask) {
      subtask.isCompleted = isCompleted; // Toggle the isCompleted property
    }
  
    return { ...state };
  }),
 
 
}));
