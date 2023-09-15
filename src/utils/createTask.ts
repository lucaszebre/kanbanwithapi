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
export const createTask = async (taskTitle:string,taskDescription:string,columnId:string,SubTaskCurrent?:string[]) =>{
    try{
        
                // User is authenticated, check if a row exists in the "User" table
                console.log('taskTitle',taskTitle,'taskDescription',taskDescription,'columnId',columnId,'Subtask',SubTaskCurrent)
                
                    const response = await axiosInstance.post(`/column/${columnId}/tasks/`,
                    {
                        title:taskTitle,
                        description:taskDescription,
                        subtasks:createSubTaskArray(SubTaskCurrent||[])
                    });
                    if(response.data){
                        console.log('Task add')
                    }else{
                        console.error("Problem to task the boards")
                    } 
                
                
            }
    catch(error){
        console.error('message',error)
    }
}