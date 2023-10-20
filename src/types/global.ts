interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
}

interface Task {
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

interface Board {
  id: string;
  name: string;
  columns: Column[];
}

interface User {
  id: string;
  name: string;
  email: string;
  boards: Board[];
}

type TaskManager = User[]; // An array of User objects
  