import { Subtask } from "@/types/Zodtype";
import { axiosInstance } from "./instance";



export  interface Task {
    id:string
    title:string
    status: string
    description:string
    subtasks:Subtask[]
  }
export const changeColumn = async (newColumnId: string,columnId:string,newtask:Task) => {
    if (newColumnId !== columnId) {
        try{
            console.log(newtask,'newtask')
            const response = await axiosInstance.post(`/column/${newColumnId}/tasks/`,
            newtask
            );
            if(response){
                return response
            }else{
                console.error('Error changing column name')
            }
        }catch(error){
            console.error("message",'Internal server error')
        }
        }
    };



    