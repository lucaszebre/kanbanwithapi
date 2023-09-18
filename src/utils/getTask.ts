import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";

export const getTask = async (taskId:string) =>{
    try{

        const response = await axiosInstance.get(`/tasks/${taskId}`);
        if(response){
            return response.data
            
        }else{
            handleSessionExpiration()
            console.error('Error fetching boards')
        }
    }catch(error){
        handleSessionExpiration()
        console.error(error)
    }
};