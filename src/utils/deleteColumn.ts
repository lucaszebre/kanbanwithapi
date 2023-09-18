import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";

export const deleteColumn = async (columnId:string) =>{
    try{
        const response = await axiosInstance.delete(`/column/${columnId}`);
        if(response){
            return response
        }else{
            handleSessionExpiration()
            console.error('Error deleting Column')
        }
    }catch(error){
        handleSessionExpiration()
        console.error("message",'Internal server error')
    }
}