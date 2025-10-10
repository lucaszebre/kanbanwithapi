import type { Column, Subtask, Task, TaskManager } from "@/types/global";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

type State = {
  taskManager: TaskManager;
  addBoard: (boardName: string, column: string[]) => void;
  updateBoard: (data: { id: string; name: string; columns: Column[] }) => void;
  deleteBoard: (boardId: string) => void;

  updateColumn: (data: {
    boardId: string;
    id: string;
    name: string;
    tasks?: Task[];
  }) => void;

  addTask: (data: {
    boardId: string;
    title: string;
    id: string;
    description: string;
    columnId: string;
    subtasks: Subtask[];
    index: number;
  }) => void;
  updateTask: (data: {
    boardId: string;
    id: string;
    title: string;
    description: string;
    columnId: string;
    subtasks: Subtask[];
    index: number;
  }) => void;
  deleteTask: (data: { boardId: string; columnId: string; id: string }) => void;

  toggleSubtask: (data: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
    isCompleted: boolean;
  }) => void;
  setTaskManagerData: (data: TaskManager) => void;
  changeCol: (data: {
    newColumnId: string;
    boardId: string;
    columnId: string;
    taskId: string;
  }) => void;
  insertTaskAtColumn: (data: {
    boardId: string;
    targetColumnId: string;
    sourceColumnId: string;
    initialIndex: number;
    targetIndex: number;
  }) => void;
  updateColumns: (data: { boardId: string; columns: Column[] }) => void;
  updateTasks: (data: {
    boardId: string;
    columnId: string;
    tasks: Task[];
  }) => void;
};

export const useTaskManagerStore = create<State>((set) => ({
  taskManager: {
    id: uuidv4(),
    name: "",
    email: "",
    boards: [],
  },
  setTaskManagerData: (data: TaskManager) => set({ taskManager: data }),

  addBoard: (boardName, columnNames) =>
    set((state) => {
      const columns = columnNames.map((name, index) => ({
        id: uuidv4(),
        name,
        index,
        tasks: [],
      }));

      // Assuming the first user for simplicity
      const user = state.taskManager;

      return {
        ...state,
        taskManager: {
          ...user,
          boards: [...user.boards, { id: uuidv4(), name: boardName, columns }],
        },
      };
    }),

  updateBoard: (data: { id: string; name: string; columns: Column[] }) =>
    set((state) => {
      const updatedBoards = state.taskManager.boards.map((board) => {
        if (board.id !== data.id) return board;

        let updatedColumns = board.columns;

        const recordColumns = data.columns.reduce<Record<string, string>>(
          (prev, c) => {
            return {
              ...prev,
              [c.id]: c.name,
            };
          },
          {}
        );

        // Delete columns
        updatedColumns = updatedColumns
          .filter((col) => !data.columns.map((c) => c.id).includes(col.id))
          .map((c) => {
            return {
              ...c,
              name: recordColumns[c.id as string],
            };
          });

        // Return updated board
        return {
          ...board,
          name: data.name ?? board.name, // assuming 'boardName' is the identifier for updating the board name
          columns: updatedColumns,
        };
      });

      return {
        ...state,
        taskManager: {
          ...state.taskManager,
          boards: updatedBoards,
        },
      };
    }),

  deleteBoard: (boardId) =>
    set((state) => {
      const boards = state.taskManager.boards.filter((b) => b.id !== boardId);
      return {
        ...state,
        taskManager: {
          ...state.taskManager,
          boards,
        },
      };
    }),
  // column
  updateColumn: ({
    boardId,
    id,
    name,
    tasks,
  }: {
    boardId: string;
    id: string;
    name: string;
    tasks?: Task[];
  }) =>
    set((state) => {
      const board = state.taskManager.boards.find(
        (board) => board.id === boardId
      );

      const columns = board?.columns.map((c) => {
        if (c.id === id) {
          return { ...c, name, tasks: tasks ?? [] };
        }
        return c;
      });

      const boards = state.taskManager.boards.map((b) => {
        if (b.id === board?.id) {
          return {
            ...b,
            columns: columns ?? [],
          };
        }
        return b;
      });
      return {
        ...state,
        taskManager: {
          ...state.taskManager,
          boards,
        },
      };
    }),

  // Task

  addTask: ({
    boardId,
    id,
    title,
    description,
    columnId,
    subtasks,
    index,
  }: {
    boardId: string;
    id: string;
    title: string;
    description: string;
    columnId: string;
    subtasks: Subtask[];
    index: number;
  }) =>
    set((state) => {
      const newTask: Task = {
        id, // Use a function or library to generate unique IDs
        title,
        columnId,
        index,
        description,
        status: "to do", // Assuming Task type has a description property
        subtasks,
      };

      const board = state.taskManager.boards.find((b) => b.id === boardId);
      const column = board?.columns.find((c) => c.id === columnId);
      if (column) {
        column.tasks.push(newTask);
      }

      return { ...state };
    }),

  updateTask: (data: {
    boardId: string;
    id: string;
    title: string;
    description: string;
    columnId: string;
    subtasks: Subtask[];
    index: number;
  }) =>
    set((state) => {
      const { boardId, id, title, description, columnId, subtasks } = data;
      // Find the board and column
      const board = state.taskManager.boards.find((b) => b.id === boardId);
      if (!board) return state;
      const column = board?.columns.find((c) => c.id === columnId);

      if (!column) return state; // If no column found, return the current state

      // Clone the tasks array for immutability
      const updatedTasks = [...column.tasks];

      // Find the task index (we'll use this to replace the task in the array)
      const taskIndex = updatedTasks.findIndex((t) => t.id === id);
      if (taskIndex === -1) return state; // If no task found, return the current state

      const originalTask = updatedTasks[taskIndex];

      // Construct the updated task
      const updatedTask = {
        ...originalTask,
        title,
        description,
        subtasks,
      };

      // Replace the task in the array
      updatedTasks[taskIndex] = updatedTask;

      // Update the column's tasks
      const updatedColumns = board.columns.map((c) =>
        c.id === columnId ? { ...c, tasks: updatedTasks } : c
      );

      return {
        ...state,
        taskManager: {
          ...state.taskManager,
          boards: state.taskManager.boards.map((b) =>
            b.id === boardId ? { ...b, columns: updatedColumns } : b
          ),
        },
      };
    }),

  deleteTask: ({ boardId, columnId, id }) =>
    set((state) => {
      // Defensive: if no users or boards just return state
      const user = state.taskManager;
      if (!user) return state;

      const updatedBoards = user.boards.map((b) => {
        if (b.id !== boardId) return b; // unchanged board
        return {
          ...b,
          columns: b.columns.map((c) => {
            if (c.id !== columnId) return c; // unchanged column
            const filteredTasks = c.tasks.filter((t) =>
              t.id === id ? false : true
            );
            // If no change, return same ref to avoid unnecessary renders
            if (filteredTasks === c.tasks) return c;
            return { ...c, tasks: filteredTasks };
          }),
        };
      });

      // Only create new user object if boards changed
      const userChanged = updatedBoards.some(
        (b, idx) => b !== user.boards[idx]
      );
      if (!userChanged) return state;

      return {
        ...state,
        taskManager: {
          ...user,
          boards: updatedBoards,
        },
      };
    }),

  // Subtask CRUD
  toggleSubtask: (data: {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
    isCompleted: boolean;
  }) =>
    set((state) => {
      const { boardId, columnId, taskId, subtaskId, isCompleted } = data;
      const board = state.taskManager.boards.find((b) => b.id === boardId);
      const column = board?.columns.find((c) => c.id === columnId);
      const task = column?.tasks.find((t) => t.id === taskId);
      const subtask = task?.subtasks.find((s) => s.id === subtaskId);

      if (subtask) {
        subtask.isCompleted = isCompleted; // Toggle the isCompleted property
      }

      return { ...state };
    }),
  changeCol: (data: {
    newColumnId: string;
    boardId: string;
    columnId: string;
    taskId: string;
  }) => {
    set((state) => {
      const { newColumnId, boardId, columnId, taskId } = data;
      const board = state?.taskManager?.boards?.find((b) => b.id === boardId);
      const sourceColumn = board?.columns?.find((col) => col.id === columnId);
      const destinationColumn = board?.columns.find(
        (col) => col.id === newColumnId
      );

      if (!sourceColumn || !destinationColumn) {
        console.error("Either source or destination column not found");
        return state;
      }

      const taskIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === taskId
      );
      if (taskIndex === -1) {
        console.error("Task not found in source column");
        return state;
      }

      // Remove the task from the source column
      const [taskToMove] = sourceColumn.tasks.splice(taskIndex, 1);

      // Add the task to the destination column
      destinationColumn.tasks.push(taskToMove);

      return { ...state };
    });
  },
  insertTaskAtColumn: (data: {
    boardId: string;
    targetColumnId: string;
    sourceColumnId: string;
    initialIndex: number;
    targetIndex: number;
  }) => {
    set((state) => {
      const {
        boardId,
        targetColumnId,
        sourceColumnId,
        initialIndex,
        targetIndex,
      } = data;

      const boardIndex = state.taskManager.boards.findIndex(
        (b) => b.id === boardId
      );
      if (boardIndex === -1) return state;

      const board = state.taskManager.boards[boardIndex];

      const sourceColumnIndex = board.columns.findIndex(
        (col) => col.id === sourceColumnId
      );
      const targetColumnIndex = board.columns.findIndex(
        (col) => col.id === targetColumnId
      );

      if (sourceColumnIndex === -1 || targetColumnIndex === -1) {
        return state;
      }

      const sourceColumn = board.columns[sourceColumnIndex];
      const targetColumn = board.columns[targetColumnIndex];

      // Validate that the initial index is within bounds
      if (initialIndex < 0 || initialIndex >= sourceColumn.tasks.length) {
        return state;
      }

      // Remove the task from the source column at the initial index
      const [taskToMove] = sourceColumn.tasks.splice(initialIndex, 1);

      // Update the task's column ID and index
      taskToMove.columnId = targetColumnId;
      taskToMove.index = targetIndex;

      // Insert the task into the target column at the target index
      targetColumn.tasks.splice(targetIndex, 0, taskToMove);

      // Re-index tasks in both columns
      sourceColumn.tasks.forEach((task, i) => (task.index = i));
      targetColumn.tasks.forEach((task, i) => (task.index = i));

      const newBoards = [...state.taskManager.boards];
      newBoards[boardIndex] = {
        ...board,
        columns: [...board.columns],
      };

      console.log(newBoards, "boards");
      return {
        taskManager: {
          ...state.taskManager,
          boards: newBoards,
        },
      };
    });
  },
  updateColumns: (data: { boardId: string; columns: Column[] }) => {
    set((state) => {
      const { boardId, columns } = data;

      const boardIndex = state.taskManager.boards.findIndex(
        (b) => b.id === boardId
      );
      if (boardIndex === -1) return state;

      const board = state.taskManager.boards[boardIndex];

      const newBoards = [...state.taskManager.boards];
      newBoards[boardIndex] = {
        ...board,
        columns,
      };

      return {
        taskManager: {
          ...state.taskManager,
          boards: newBoards,
        },
      };
    });
  },
  updateTasks: (data: { boardId: string; columnId: string; tasks: Task[] }) => {
    set((state) => {
      const { boardId, columnId, tasks } = data;

      const boardIndex = state.taskManager.boards.findIndex(
        (b) => b.id === boardId
      );
      if (boardIndex === -1) return state;

      const board = state.taskManager.boards[boardIndex];

      const columnIndex = board.columns.findIndex((c) => c.id === columnId);

      const newColumn = {
        ...board.columns[columnIndex],
        tasks: [...tasks.map((t, index) => ({ ...t, index }))],
      };

      console.log(newColumn, "que passa bien ?");

      const newColumns = board.columns.map((c, index) => {
        if (index === columnIndex) {
          return newColumn;
        }
        return c;
      });

      const newBoards = [...state.taskManager.boards];
      newBoards[boardIndex] = {
        ...board,
        columns: newColumns,
      };

      return {
        taskManager: {
          ...state.taskManager,
          boards: newBoards,
        },
      };
    });
  },
}));
