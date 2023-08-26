import supabase from "@/supabase";
import { Subtask } from "@/types/Zodtype";
import axios from "axios";
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
export const createTask = async (taskTitle:string,taskDescription:string,boardId:string,columnId:string,SubTaskCurrent?:string[],subtask?:Subtask[]) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                // User is authenticated, check if a row exists in the "User" table
                console.log('taskTitle',taskTitle,'taskDescription',taskDescription,'boardId',boardId,'columnId',columnId,'Subtask',SubTaskCurrent)
                if(subtask){
                    const response = await axios.post(`https://kanbantask.onrender.com/user/${user.id}/boards/${boardId}/columns/${columnId}`,
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
                }else if(SubTaskCurrent){
                const response = await axios.post(`https://kanbantask.onrender.com/user/${user.id}/boards/${boardId}/columns/${columnId}`,
                    {
                        title:taskTitle,
                        description:taskDescription,
                        subtasks:[]
                    });
                    if(response.data){
                        console.log('Task add')
                    }else{
                        console.error("Problem to task the boards")
                    }
                }
            }
    }catch(error){
        console.error('message',error)
    }
}