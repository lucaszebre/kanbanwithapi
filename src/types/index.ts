import z from "zod";
import type { Board } from "./Zodtype";
import type { Task } from "./global";

export type BoardData = {
  boards: Board[];
};

export type Data = {
  boards: {
    name: string;
    id: string;
    columns: {
      name: string;
      id: string;
      tasks: {
        id: string;
        title: string;
        description: string;
        status: string;
        subtasks: {
          id: string;
          title: string;
          isCompleted: boolean;
        }[];
      }[];
    }[];
  }[];
};

export type ColumnToRename = {
  id: string;
  name: string;
};

export type RequestBody = {
  boardId: string;
  boardName: string;
  columnsToAdd: ColumnToRename[];
  columnsToRename: ColumnToRename[];
  columnsToRemove: string[];
};

export type ResponseError = {
  message: string;
};

export type ColumnData = {
  id: string;
  name: string;
};

export type TaskData = {
  id: string;
  title: string;
  description: string;
  status: string;
  columnId: string;
  subtasks: Array<{
    title: string;
    isCompleted: boolean;
  }>;
};

export type boards = {
  id: string;
  name: string;
};

export type AddBoardType = {
  BoardName: string;
};

export type BoardType = {
  id: string;
  name: string;
  userId: string;
  columns: ColumnType[];
};
export type ColumnAddType = {
  id: string;
  name: string;
  boardId: string;
  tasks: TaskType[];
  add: boolean; // Make sure it's 'tasks' instead of 'task'
};

export type ColumnType = {
  id: string;
  name: string;
  index: number;
  tasks: TaskType[];
  add?: boolean; // Make sure it's 'tasks' instead of 'task'
};
export type ColumntoAddType = {
  id: string;
  name: string;
  boardId: string;
  tasks: TaskType[];
  add?: boolean; // Make sure it's 'tasks' instead of 'task'
};
export type TaskType = {
  id: string;
  title: string;
  status: string;
  description: string;
  columnId: string;
  subtasks: SubtaskType[];
};

export type SubtaskType = {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
};

export type SubtaskedType = {
  id: string;
  title: string;
  isCompleted: boolean;
  add?: boolean;
};

export type ListTaskPropsType = {
  tasks: Task[];
  title: string;
  NbList: number;
  columnId: string;
  columnIndex: number;
};

export const SchemaLogin = z.object({
  email: z.string().min(1, { message: "need a username" }),
  password: z.string().min(1, { message: "at least 1 characters long" }),
});

export type FormDataRegisterType = {
  email: string;
  password: string;
  username: string;
};

export const schemaProfile = z.object({
  firstname: z.string().min(1, { message: "cant be empty" }),
  lastname: z.string().min(1, { message: "cant be empty" }),
  email: z.email({ message: "Invalid email format" }),
});

export const SchemaRegister = z.object({
  email: z.email().min(1, { message: "need a email" }),
  name: z.string().min(1, { message: "need a first name" }),
  password: z.string().min(1, { message: "at least 1 characters long" }),
});

export const AddTask = z.object({
  title: z.string().min(1, { message: "need a email" }),
  description: z.string().min(1, { message: "need a email" }),
  subtaskArray: z.array(z.string()),
});
