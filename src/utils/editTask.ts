import {  Subtasked } from "@/types";
import { axiosInstance } from "./instance";
function createSubTaskArray(subTasked: Subtasked[]) {
        const subtaskArray = [];
    
        for (const subtask of subTasked) {
        const { title, isCompleted } = subtask;
        subtaskArray.push({id:subtask.id, title:title, isCompleted:isCompleted });
        }
    
        return subtaskArray;
}
export const editTask = async (taskId:string,taskName:string,taskDescription:string,subTasked:Subtasked[]) =>{
    try{
                    console.log(subTasked)
                // User is authenticated, check if a row exists in the "User" table
                const response = await axiosInstance.put(
                    `hhttp://localhost:4000/tasks/${taskId}`,
                    {
                        title:taskName,
                        description:taskDescription,
                        subtasks: subTasked    
                    });
                    if(response.data){
                        console.log('Edit Task sucessfully')
                    }else{
                        console.error("Problem to Edit the tasks")
                    }
                }
    catch(error){
        console.error('message',error)
    }
}