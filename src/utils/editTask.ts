import supabase from "@/supabase";
import {  Subtasked } from "@/types";
import axios from "axios";
function createSubTaskArray(subTasked: Subtasked[]) {
        const subtaskArray = [];
    
        for (const subtask of subTasked) {
        const { title, isCompleted } = subtask;
        subtaskArray.push({_id:subtask._id, title:title, isCompleted:isCompleted });
        }
    
        return subtaskArray;
}
export const editTask = async (boardId:string,columnId:string,taskId:string,taskName:string,taskDescription:string,subTasked:Subtasked[]) =>{
    try{
        const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    console.log(subTasked)
                // User is authenticated, check if a row exists in the "User" table
                const response = await axios.put(
                    `https://kanbantask.onrender.com/user/${user.id}/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
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
    }catch(error){
        console.error('message',error)
    }
}