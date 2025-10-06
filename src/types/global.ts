type Subtask = {
  id: string;
  title: string;
  isCompleted: boolean;
};

type Column = {
  id: string;
  name: string;
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
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
};
export type TaskManager = User[]; // An array of User objects
