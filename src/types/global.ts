export type Subtask = {
  id: string;
  index: number;
  title: string;
  isCompleted: boolean;
};

export type Column = {
  id: string;
  name: string;
  index: number;
  tasks: Task[];
};

export type Board = {
  id: string;
  name: string;
  columns: Column[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  boards: Board[];
};
export type Task = {
  id: string;
  index: number;
  columnId: string;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
};
export type TaskManager = User; // An array of User objects
