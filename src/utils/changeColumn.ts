import { Subtask } from "@/types/Zodtype";
import { createTask } from "./createTask";
import { deleteTask } from "./deleteTask";



export   interface Task {
    title:string
    description:string
    subtasks:Subtask[]
  }
export const changeColumn = async (newColumnId: string,columnId:string,boardId:string,taskId:string,newtask:Task) => {
    if (newColumnId !== columnId) {
        try {
            console.log(taskId,'taskId')
            // Reference to the current task
            
            await createTask(newtask.title,newtask.description,boardId,newColumnId,undefined,newtask.subtasks)
            await deleteTask(taskId)
            
        } catch (error) {
            console.error("Error updating task column:", error);
        }
        }
    };



    