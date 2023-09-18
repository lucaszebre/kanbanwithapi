import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";

export const toggleSubtaskCompletion = async (isCompleted:boolean, subtaskId: string) => {
    try {

        const response = await axiosInstance.put(`/subtask/${subtaskId}`,
        {
            "isCompleted": isCompleted
        });
        if(response){
            return 
        }else{
            handleSessionExpiration()
            console.error('Error fetching boards')
        }
    }catch(error){
        handleSessionExpiration()
        console.error(error)
    }
    

    };