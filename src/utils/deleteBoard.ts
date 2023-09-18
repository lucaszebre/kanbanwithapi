import { handleSessionExpiration } from "./handleSessionexpiration";
import { axiosInstance } from "./instance";

export const deleteBoard = async (boardId:string) =>{
    try{
        const response = await axiosInstance.delete(`/boards/${boardId}`);
        if(response){
            return response
        }else{
            handleSessionExpiration()
            console.error('Error deleting Board')
        }
    }catch(error){
        handleSessionExpiration()

    }
}