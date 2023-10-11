import { Subtask } from "@/types/Zodtype";
import { axiosInstance } from "./instance";
import { handleSessionExpiration } from "./handleSessionexpiration";


export  interface Task {
    id:string
    title:string
    status: string
    description:string
    subtasks:Subtask[]
  }
export const changeColumn = async (newColumnId: string,columnId:string,taskId:string) => {
    if (newColumnId !== columnId) {
        try{
            const response = await axiosInstance.put(`/tasks/${taskId}/column/${newColumnId}`);
            if(response){
                return response
            }else{
                console.error('Error changing column name')
                handleSessionExpiration()
            }
        }catch(error){
            handleSessionExpiration()
            console.error("message",'Internal server error')
        }
        }
    };



    