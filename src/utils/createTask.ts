import { Subtask } from "@/types/Zodtype";
import { axiosInstance } from "./instance";
import { nanoid } from "nanoid";

function createSubTaskArray(SubTaskCurrent:string[]) {
    const SubtaskArray = [];
  
    for (const columnName of SubTaskCurrent) {
      const subtask = {
        title: columnName,
        isCompleted: false,
      };
      SubtaskArray.push(subtask);
    }
  
    return SubtaskArray;
  }
export const createTask = async (taskTitle:string,taskDescription:string,columnId:string,SubTaskCurrent?:string[],subtask?:Subtask[]) =>{
    try{
                // User is authenticated, check if a row exists in the "User" table
                console.log('taskTitle',taskTitle,'taskDescription',taskDescription,'columnId',columnId,'Subtask',SubTaskCurrent)
                if(subtask){
                    const response = await axiosInstance.post(`http://localhost:4000/columns/${columnId}/tasks`,
                    {
                        title:taskTitle,
                        description:taskDescription,
                        subtasks:subtask
                    });
                    if(response.data){
                        console.log('Task add')
                    }else{
                        console.error("Problem to task the boards")
                    } 
                }
                
            }
    catch(error){
        console.error('message',error)
    }
}