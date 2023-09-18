import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";


export const deleteTask = async (taskId:string) =>{
    try{
        const response = await axiosInstance.delete(`/tasks/${taskId}`);
        if(response){
            console.log(response.status)
        }else{
            handleSessionExpiration()
            console.error('Error deleting task')
        }
    }catch(error){
        handleSessionExpiration()
    }
}