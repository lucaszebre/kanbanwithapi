interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
}

export interface Task {
  id: string;
  title: string;
  description:string;
  status:string;
  subtasks: Subtask[];
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  boards: Board[];
}

export type TaskManager = User[]; // An array of User objects
  