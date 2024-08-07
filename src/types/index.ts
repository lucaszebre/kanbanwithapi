import z from "zod"


export type BoardData = {
    boards: Board[];
}

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




export interface Board {
    id: string;
    name: string;
    userId: string;
    columns: Column[];
    }
    export interface ColumnAdd {
        id: string;
        name: string;
        boardId: string;
        tasks: Task[];
        add:boolean // Make sure it's 'tasks' instead of 'task'
    }

    export interface Column {
        id: string;
        name: string;
        tasks: Task[];
        add?:boolean // Make sure it's 'tasks' instead of 'task'
    }
     export interface ColumntoAdd {
        id: string;
        name: string;
        boardId: string;
        tasks: Task[];
        add?:boolean // Make sure it's 'tasks' instead of 'task'
    }
    export interface Task {
        id: string;
        title: string;
        status:string
        description: string;
        columnId?: string;
        subtasks : Subtask[]
    }
    
    export interface Subtask {
        id: string;
        title: string;
        isCompleted: boolean;
        taskId: string;
    }

    export interface Subtasked{
        id:string
        title:string;
        isCompleted:boolean
        add?:boolean;
    }



  export   interface ListTaskProps {
        tasks: Task[];
        title: string;
        NbList: number;
        columnId:string
        columnIndex:number
        }


        export const SchemaLogin = z.object({
            email: z.string().min(1,{ message: 'need a username' }),
            password: z.string().min(1, { message: 'at least 1 characters long' })
            ,
          });
          
          export interface FormDataRegister {
            email: string;
            password: string;
            username: string;
          }
          
          
          
          export const schemaProfile = z.object({
            firstname: z.string().min(1, { message: 'cant be empty' }),
            lastname: z.string().min(1, { message: 'cant be empty' }),
            email: z.string().email({ message: 'Invalid email format' }),
            });

  
  export const SchemaRegister = z.object({
    email: z.string().email().min(1,{ message: 'need a email' }),
    name: z.string().min(1,{ message: 'need a first name' }),
    password: z.string().min(1, { message: 'at least 1 characters long' })
    ,
  });
  
  export const AddTask = z.object({
    title: z.string().min(1,{ message: 'need a email' }),
    description: z.string().min(1,{ message: 'need a email' }),
    subtaskArray: z.array(z.string()),
  });